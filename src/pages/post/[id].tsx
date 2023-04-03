import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/Layout";
import { Tweet } from "~/components/Tweet";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

type ProfilePageProps = NextPage<{ username: string }>;

const ProfileFeed = ({ userId }: { userId: string }) => {
  const { data: postsData } = api.posts.getPostsByUser.useQuery({
    userId,
  });

  if (!postsData) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {postsData.map(({ post, author }) => (
        <Tweet key={post.id} {...{ post, author }} />
      ))}
    </div>
  );
};

const ProfilePage: ProfilePageProps = (props) => {
  const { username } = props;

  const { data: user } = api.profiles.getUserByUsername.useQuery({
    username,
  });

  if (!user) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 border-slate-400 bg-slate-600">
          <Image
            alt="Profile picture"
            src={user.image}
            width={96}
            height={96}
            className="absolute bottom-0 left-0 -mb-[48px] ml-4 flex items-center justify-center rounded-full border-2 border-red-100"
          />
        </div>

        <div className="h-[52px]" />

        <div className="flex flex-col border-b p-4">
          <div className="text-xl">{user.name}</div>

          <div className="text-sm">{`@${user.username}`}</div>
        </div>

        <ProfileFeed userId={user.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No slug");
  }
  const username = slug.replace("@", "");

  await ssg.profiles.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
