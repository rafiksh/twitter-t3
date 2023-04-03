import { clerkClient } from "@clerk/nextjs/server";

import { type User } from "@clerk/nextjs/dist/api";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type Post } from "@prisma/client";

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

const addUsersToPosts = async (posts: Post[]) => {
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
};

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = await addUsersToPosts(posts);

    return result;
  }),
  getPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
        },
        take: 100,

        orderBy: {
          createdAt: "desc",
        },
      });

      const result = await addUsersToPosts(posts);

      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "Too short of a message").max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are posting too fast",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId,
        },
      });

      return post;
    }),
});
