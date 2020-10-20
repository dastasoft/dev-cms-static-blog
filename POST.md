# SIMPLE STATIC BLOG WITH NEXTJS AND DEV.TO

Vamos a montar un blog estático utilizando Next.js y dev.to como headless CMS.

Si quieres ir directamente al resultado final [en este repo]() tienes el proyecto final que también sirve como boilerplate para futuros blogs estáticos.

## Motivación

Cuando estaba haciendo el blog para [Nimbel](nimbel.net) necesitaba hacer un blog de forma rápida y que se adaptase a la naturaleza estática del resto de la página. Desde Nimbel queriamos poder publicar articulos en [Dev.to](dev.to) y al mismo tiempo mantener actualizado el blog personal.

La estrategia que seguiremos en este tutorial será:

- Aprovechar las capacidades estáticas de NextJS y la API de Dev.to para hacer un fetch de los post del usuario en tiempo de build.
- Crear las rutas estáticas a todos los post que hemos hecho fetch.
- Utilizar los webhooks de Dev.to para que cada vez que el usuario cree y/o actualice un post, se genere un nuevo build de nuestro sitio estático.
- Crear una plantilla base (boileplate) que nos servirá para crear cualquier otro blog siguiendo esta misma estrategia.

## Paso a paso

### Pre requisitos

- Cuenta de [dev.to](dev.to)
- Cuenta de [Vercel]()
- [NodeJS]() instalado
- [npm]() o [yarn]()

### Creación del proyecto

En mi caso utilicé mi propio boilerplate de NextJS con TailwindCSS que podéis descargar desde [aquí](https://github.com/dastasoft/nextjs-boilerplate) o simplemente utilizando uno de los siguientes comandos:

```sh
yarn create next-app my-app-name --example "https://github.com/dastasoft/nextjs-boilerplate"

npx create-next-app my-app-name --use-npm --example "https://github.com/dastasoft/nextjs-boilerplate"
```

Esto os creará un nuevo proyecto NextJS con TailwindCSS ya configurado.

### Estructura

En NextJS no necesitamos definir rutas, cada JS que esté dentro de la carpeta `pages` será considerado una ruta accesible (menos `_app` y otros `_` archivos que se consideran privados).

Organizaremos el proyecto con las siguientes rutas:

```sh
- pages
|- blog
|-- posts
|--- [slug].js
|- _app.js
|- blog.js
|- index.js
```

- `_app.js` contendrá el layout general de la aplicación que aplicaremos a todas las rutas de nuestra aplicación.
- `blog.js` contendrá la estructura general de la página dedicada al blog así como el fetch a los posts para poder mostrarlos en forma de tarjetas.
- `index.js` será nuestra pagina de inicio.
- `blog/posts/[slug].js` este punto necesita algo mas de explicación:
  - Al crear una estructura le estamos diciendo al router que en la ruta `nuestro-dominio/blog/posts/slug` encontrará un elemento `slug` que será dinámico y estará accesible mediante era ruta exacta.
  - Dentro de ese JS deberemos definir que valor toma el parametro dinámico `slug`, que en nuestro caso sera el propio slug (url) del post, por lo que deberemos hacer un fetch de ese post en concreto y consultar sus datos en tiempo de build.
  - Deberemos definir todos los paths posibles (uno por cada post) de cara a que cuando el usuario navegue o escriba directamente en la url `nuestro-dominio/blog/post/este-post-existe` ese slug ya este creado en tiempo de build, ya que la página es totalmente estática y no irá a consultar nuevos datos fuera del build\*.

### SSG vs SSR vs ISR

- SSG (Static Site Generation), es el modo por defecto en el que trabaja NextJS, se puede utilizar en combinación con las funciones `getStaticProps` y `getStaticPaths` que provee el propio framework, las diferentes páginas se generan de forma estática en tiempo de build.
- SSR (Server Side Rendering), se generán las páginas bajo demanda por cada petición desde el servidor, se utiliza en combinación con la función `getServerSideProps`.
- ISR (Incremental Static Regeneration), disponible a partir de la version 9.5 de NextJS. Te perimite actualizar páginas que se crearon como estáticas y al entrar una nueva petición se detecta que está en un estado obsoleto y debe re-renderizarse. Para activar ISR se añade una propiedad `revalidate` en la función `gettaticProps`.

En esta guía vamos a tratar solo SSG, para información mas detallada de los otros metódos [consultar la documentación oficial](https://nextjs.org/docs/basic-features/data-fetching), NextJS no necesita ninguna configuración especial para cambiar (o incluso combinar!) entre los diferentes modos, todo recae en la utilización de las funciones especiales ligadas a cada tipo.

Este es un apartado complejo y muy amplio y es precisamente donde NextJS brilla por la posibilidad de elegir fácilmente entre ellos o incluso combinarlos. Lo dejo para una futura guía :) la cual deberia explicar cuando utilizar unos metódos u otros segun la naturaleza de cada página.

En nuestro caso, debido a que todos los datos los tenemos disponibles en tiempo de build, dado que los vamos a buscar a la API de dev.to y no tenemos que cambiar nada de nuestra web a menos que cambie algo en nuestro CMS (dev.to) no tiene sentido estar repitiendo las mismas consultas por cada usuario que entra, es mucho mas

### Creando el Blog

Empezaremos creando el `blog.js` en nuestra carpeta `pages`.

La parte mas importante es como hacemos fetch de todos los posts de un usuario en tiempo de build para poder pintar los posts como tarjetas, para ello utilizaremos una de las funciones SSG que nos proporciona NextJS, `getStaticProps`:

```js
export const getStaticProps = async () => {
  const devDotToPosts = await fetch(
    `https://dev.to/api/articles?username=${process.env.DEV_USERNAME}`
  );

  const res = await devDotToPosts.json();

  return {
    props: {
      devDotToPosts: res
    }
  };
};
```

### Creando el Artículo

El siguiente paso a realizar para que la generación estática sea posible es definir todas las posibles rutas que el usuario pueda visitar al entrar en esta página, para que sean accesibles las tenemos que pre-renderizar en tiempo de build y NextJS necesita saber la lista completa, esto lo conseguiremos con otra de las funciones que provee NextJS `getStaticPaths`.

```js
export async function getStaticPaths() {
  const devDotToPosts = await fetch(
    `https://dev.to/api/articles?username=${process.env.DEV_USERNAME}`
  );
  const posts = await devDotToPosts.json();

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug
        }
      };
    }),
    fallback: false
  };
}
```

Creamos una ruta por cada post publicado, utilizando su `slug` como en el caso anterior. Definimos `fallback` como `false` ya que no planeamos soportar URLs que esten fuera de las que estamos generando estáticamente, tener esta propiedad a false devolverá un 404 si se intenta consultar cualquier URL que este fuera del array que proporcionamos en `paths`.

Habilitar la propiedad `fallback` tiene numerosas aplicaciones y puede ser utilizada en combinación con `Incremental Static Generation` el cual es una opción muy potente dentro de NextJS, para más información sobre este tema [consultar la documentación oficial](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation)

#### Datos del artículo

Dentro del artículo en concreto, necesitamos recuperar los datos, para ello consultaremos la API de dev.to usando el mismo `slug` con el que hemos construido la URL.

```js
export const getStaticProps = async ({ params }) => {
  const devDotToPost = await fetch(
    `https://dev.to/api/articles/${process.env.DEV_USERNAME}/${params.slug}`
  );
  const res = await devDotToPost.json();

  return {
    props: {
      devDotToPost: res
    }
  };
};
```

Todos los datos que nos llegan desde la API de dev.to los pasamos en tiempo de build a la página del artículo en concreto, estos datos serán accesibles a través de la `prop` `devDotToPost`.

```js
export default function Post({ devDotToPost }) {
    ...
}
```

#### Imprimir el markdown

Una vez ya tenemos los datos del artículo, entre los múltiples campos que nos llegan de la API, el contenido en markdown está en `body_html`, para utilizarlo:

```js
<div className="markdown" dangerouslySetInnerHTML={{ __html: body_html }} />
```

En la clase `markdown` deberás definir como quieres que se vean los elementos contenidos en el markdown ya que la API devuelve una versión raw del markdown. En el [proyecto de ejemplo](https://github.com/dastasoft/dev-cms-static-blog/blob/master/styles/index.css) tienes disponible una propuesta simple.

#### [slug].js al completo

Así es como queda nuestra template para cualquier artículo, podéis verlo directamente en el [repo](https://github.com/dastasoft/dev-cms-static-blog/blob/master/pages/blog/posts/%5Bslug%5D.js):

```js
import Head from 'next/head';
import Link from 'next/link';

import TopButton from '../../../components/TopButton';

export default function Post({ devDotToPost }) {
  const {
    title,
    published_at,
    social_image,
    body_html,
    user,
    type_of,
    description,
    canonical_url
  } = devDotToPost;
  const date = new Date(published_at);
  const formatedDate = `${date.getDate()}/${
    parseInt(date.getMonth(), 10) + 1
  }/${date.getFullYear()}`;

  return (
    <div>
      <Head>
        <meta property="og:type" content={type_of} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={social_image} />
        <meta property="og:url" content={canonical_url} />
      </Head>
      <div className="flex justify-center">
        <TopButton />
        <article className="text-xs w-full md:w-3/4 ">
          <div className="border-2 text-black bg-white md:rounded-lg overflow-hidden">
            <img className="w-full" src={social_image} alt={title} />
            <div className="p-4 md:p-32">
              <h1>{title}</h1>
              <div className="flex items-center text-gray-600">
                <img
                  className="rounded-full w-12"
                  src={user.profile_image_90}
                  alt={user.name}
                />
                <span className="mx-4">{user.name}</span>
                <span className="text-sm">{formatedDate}</span>
              </div>
              <div
                className="markdown"
                dangerouslySetInnerHTML={{ __html: body_html }}
              />
            </div>
          </div>
          <Link href="/blog">
            <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0 cursor-pointer text-base pb-8">
              <svg
                className="w-4 h-4 mr-2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </a>
          </Link>
        </article>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const devDotToPost = await fetch(
    `https://dev.to/api/articles/${process.env.DEV_USERNAME}/${params.slug}`
  );
  const res = await devDotToPost.json();

  return {
    props: {
      devDotToPost: res
    }
  };
};

export async function getStaticPaths() {
  const devDotToPosts = await fetch(
    `https://dev.to/api/articles?username=${process.env.DEV_USERNAME}`
  );
  const posts = await devDotToPosts.json();

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug
        }
      };
    }),
    fallback: false
  };
}
```

### Layout

Para crear el layout y que aplique a todas las pantallas, lo crearemos en el fichero `_app.js` e internamente NextJS lo añadirá a todas las paginas:

```js
import Link from 'next/link';

import '../styles/index.css';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <nav className="p-4 flex justify-center items-center mb-4" id="nav">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer mr-4">Home</span>
        </Link>
        <Link href="/blog">
          <span className="text-xl font-bold cursor-pointer">Blog</span>
        </Link>
      </nav>
      <main className="container px-5 mx-auto">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
```

Lo importante en este punto es:

- Utilizar el componente `Link` de NextJS para que la navegación sea correcta
- Es el sitio ideal para importar el archivo de css y que aplique de forma global.
- Asegurarse de tener `<Component {...pageProps} />` ya que sin esto no veremos los componentes hijos, (similar a la utilizacion de `children` en React)

### Home

Definir la pagina principal en NextJS es tan sencillo como crear el fichero `index.js` dentro de la carpeta `pages` y NextJS creará automáticamente una ruta, en este caso a `/`, la cual mezclará lo que hayamos definido en el fichero `_app.js` mas el propio `index.js`.

Esta es la propuesta de home page para el proyecto:

```js
import DevDotToLogo from '../public/devdotto.svg';
import NextLogo from '../public/nextjs.svg';

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center">
        <a
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="NextJS"
        >
          <NextLogo className="mr-4" width="100px" height="100px" />
        </a>
        <span className="text-2xl">Blog Boilerplate</span>
      </div>

      <div className="flex justify-center items-center">
        <span className="text-2xl">with</span>
        <a
          href="https://dev.to/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dev.to"
        >
          <DevDotToLogo className="mx-4" width="100px" height="100px" />
        </a>
        <span className="text-2xl">as a CMS</span>
      </div>
    </div>
  );
}
```

\*En este caso se utilizan `anchor` normales ya que son enlaces al exterior y NextJS no tiene que acceder a ningua ruta interna. Para más información sobre la utilización de recursos como ficheros `.svg` consultar [la sección de recursos en NextJS]

### CSS

NextJS mostrará errores si intentáis introducir CSS que puedan afectar de forma global fuera del archivo `_app.js`, por ello en los demas sitios como páginas y/o componentes es recomendable utilizar soluciones como `emotionjs`, `styled-components`, `css-modules` o `tailwindcss` como en esta guía, que tienen su rango de efecto limitado al propio componente.

NextJS provee su propia solución `CSS-in-JS` llamada `styled-jsx` pero últimamente de los propios proyectos quick-start de NextJS se ha optado por implementar `css-modules`.

Si quereis conocer mejor que opciones tenéis para temas de estilo podéis consultar [mi guia de estilos en React](https://dev.to/dastasoft/styling-in-react-4fbj) la cual aplica en su mayoria para NextJS, la diferencia principal es que no podemos aplicar estilos globales como hemos comentado anteriormente.

### Recursos en NextJS

### Configuración de TailwindCSS en NextJS
