import { type NextPage } from "next";
import Image from "next/image";

import { timeAgo } from "~/utils/date";

const SinglePostPage: NextPage = () => {
  const { post, author } = {
    post: {
      id: "1",
      content: "Hello world",
      createdAt: new Date(),
    },

    author: {
      id: "1",
      username: "johndoe",
      image: "",
    },
  };

  return (
    <main className="flex border-b border-slate-400 p-4 align-middle">
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
        <span className="text-xl">{post.content}</span>
      </div>
    </main>
  );
};
export default SinglePostPage;
