import { useEffect, useState } from 'react';

const topFunction = () => {
  document.getElementById('nav').scrollIntoView({
    behavior: 'smooth'
  });
};

export default function TopButton() {
  const [display, setDisplay] = useState('hidden');

  const scrollFunction = () => {
    if (window.pageYOffset > 20) {
      setDisplay('block');
    } else {
      setDisplay('hidden');
    }
  };

  useEffect(() => {
    scrollFunction();
    window.onscroll = () => scrollFunction();
  }, []);

  return (
    <button
      type="button"
      title="Go to top"
      onClick={topFunction}
      className={`${display} fixed bottom-0 right-0 m-8 z-50 bg-black text-white cursor-pointer p-2 rounded-full text-3xl outline-none focus:outline-none hover:bg-gray-800`}
    >
      <svg
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
