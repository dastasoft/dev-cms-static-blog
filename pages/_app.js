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
