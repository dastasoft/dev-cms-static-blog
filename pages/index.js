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
