import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import { type RouterOutputs, api } from "~/utils/api";

const CreatePost = () => {
  const user = useUser();
  const [content, setContent] = useState("");

  if (!user.isSignedIn) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <Image
        className="h-12 w-12 rounded-full"
        alt="Profile picture"
        src={user.user.profileImageUrl}
        width={48}
        height={48}
      />
      <input
        className="w-full bg-transparent outline-none"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} years ago`;
    return `${Math.floor(interval)} year ago`;
  }

  interval = seconds / 2592000;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} months ago`;
    return `${Math.floor(interval)} month ago`;
  }

  interval = seconds / 86400;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} days ago`;
    return `${Math.floor(interval)} day ago`;
  }

  interval = seconds / 3600;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} hours ago`;
    return `${Math.floor(interval)} hour ago`;
  }

  interval = seconds / 60;

  if (interval > 1) {
    if (interval > 2) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(interval)} minute ago`;
  }

  return `${Math.floor(seconds)} seconds ago`;
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div className="flex border-b border-slate-400 p-4 align-middle">
      <Image
        className="h-12 w-12 rounded-full"
        alt={`Profile picture of ${author.username}`}
        src={author.image}
        width={48}
        height={48}
      />
      <div className="flex flex-col">
        <div className="flex">
          <span>{`@${author.username}`}</span>
          <span className="mx-2">•</span>
          <span className="font-thin">{timeAgo(post.createdAt)}</span>
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  const user = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4">
            <CreatePost />
          </div>
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {user.isSignedIn && (
              <div className="flex justify-center">
                <SignOutButton />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {[...data, ...data].map(({ post, author }) => (
              <PostView key={post.id} {...{ post, author }} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
