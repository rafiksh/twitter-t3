import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/Layout";
import { Tweet } from "~/components/Tweet";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

type PostPageProps = NextPage<{ id: string }>;

const PostPage: PostPageProps = (props) => {
  const { id } = props;

  const { data: postData } = api.posts.getById.useQuery({
    id,
  });

  if (!postData) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>
          {postData.post.content} - @{postData.author.username}
        </title>
      </Head>
      <PageLayout>
        <Tweet {...postData} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("No slug");
  }

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default PostPage;
