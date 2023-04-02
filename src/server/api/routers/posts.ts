import { clerkClient } from "@clerk/nextjs/server";

import { type User } from "@clerk/nextjs/dist/api";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
      orderBy: {
        createdAt: "desc",
      },
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

  create: protectedProcedure
    .input(z.object({ content: z.string().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.userId,
        },
      });

      return post;
    }),
});
