/* eslint-disable camelcase */
import BlogPost from '../components/BlogPost';
import TopButton from '../components/TopButton';

export default function Blog({ devDotToPosts }) {
  return (
    <div>
      <TopButton />
      <h2 className="mb-4 font-bold text-3xl">Posts</h2>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {devDotToPosts.map(
          ({
            id,
            type_of,
            comments_count,
            published_at,
            description,
            title,
            tag_list,
            social_image,
            positive_reactions_count,
            slug
          }) => {
            return (
              type_of === 'article' && (
                <BlogPost
                  key={id}
                  id={id}
                  img={social_image}
                  createdAt={published_at}
                  title={title}
                  desc={description}
                  slug={slug}
                  likes={positive_reactions_count}
                  comments={comments_count}
                  tagList={tag_list}
                />
              )
            );
          }
        )}
      </div>
    </div>
  );
}

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
