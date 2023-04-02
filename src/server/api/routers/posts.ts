import { clerkClient } from "@clerk/nextjs/server";

import { type User } from "@clerk/nextjs/dist/api";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

//
type UserWithUsername = User & {
  username: string;
};

const userFromClerkUser = (clerkUser: UserWithUsername) => {
  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`,
    username: clerkUser.username,
    image: clerkUser.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const clerkUsers = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
    });

    const result = posts.map((post) => {
      const author = clerkUsers.find((user) => user.id === post.authorId);

      if (!author || !author.username) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not find author",
        });
      }

      return {
        post,
        author: userFromClerkUser({ ...author, username: author.username }),
      };
    });

    return result;
  }),
});
