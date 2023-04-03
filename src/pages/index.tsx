import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";

import { type RouterOutputs, api } from "~/utils/api";
import { timeAgo } from "~/utils/date";

const CreatePost = () => {
  const user = useUser();
  const [content, setContent] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
      setContent("");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);

        setContent("");
        return;
      }

      toast.error("Failed to create post, please try again later.");
      setContent("");
    },
  });

  if (!user.isSignedIn) {
    return null;
  }

  return (
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        className="h-12 w-12 rounded-full"
        alt="Profile picture"
        src={user.user.profileImageUrl}
        width={48}
        height={48}
      />
      <input
        className={
          "w-full bg-transparent outline-none" +
          (isPosting ? " opacity-50" : "")
        }
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter" && content !== "") {
            e.preventDefault();
            mutate({ content });
          }
        }}
      />

      {content !== "" && !isPosting && (
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => mutate({ content })}
          disabled={isPosting}
        >
          Tweet
        </button>
      )}
      {isPosting && (
        <div className="flex items-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
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
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span className="mx-2">•</span>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{timeAgo(post.createdAt)}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: isPostsLoading } = api.posts.getAll.useQuery();

  if (isPostsLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <div>No posts</div>;
  }

  return (
    <div className="flex flex-col">
      {data.map(({ post, author }) => (
        <PostView key={post.id} {...{ post, author }} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Load posts on the client
  api.posts.getAll.useQuery();

  if (!userLoaded) {
    return <div />;
  }

  return (
    <PageLayout>
      <CreatePost />

      <div className="border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && (
          <div className="flex justify-center">
            <SignOutButton />
          </div>
        )}
      </div>

      <Feed />
    </PageLayout>
  );
};

export default Home;
