import Link from 'next/link';

export default function BlogPost({
  img,
  createdAt,
  title,
  desc,
  slug,
  likes,
  comments,
  tagList
}) {
  const date = new Date(createdAt);
  const formatedDate = `${date.getDate()}/${
    parseInt(date.getMonth(), 10) + 1
  }/${date.getFullYear()}`;

  return (
    <Link as={`/blog/posts/${slug}`} href="/blog/posts/[slug]">
      <article className="h-full border-2 bg-white rounded-lg overflow-hidden flex flex-col cursor-pointer">
        <img
          className="lg:h-48 md:h-36 w-full object-cover object-center"
          src={img}
          alt="blog"
        />

        <div className="p-6 flex-1">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">
            {formatedDate}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
            {title}
          </h1>
          <p className="leading-relaxed mb-3">{desc}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {tagList.map(tag => (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center flex-wrap px-6 py-4">
          <a className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">
            Continue Reading
            <svg
              className="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
          <span className="text-gray-600 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-300">
            <svg
              className="w-4 h-4 mr-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="heart"
              strokeWidth="2"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"
              />
            </svg>
            {likes}
          </span>
          <span className="text-gray-600 inline-flex items-center leading-none text-sm">
            <svg
              className="w-4 h-4 mr-1"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            {comments}
          </span>
        </div>
      </article>
    </Link>
  );
}
