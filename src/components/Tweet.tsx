import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import { timeAgo } from "~/utils/date";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const Tweet = (props: PostWithUser) => {
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
