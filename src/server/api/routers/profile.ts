import { clerkClient } from "@clerk/nextjs/server";

import { type User } from "@clerk/nextjs/dist/api";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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

export const profilesRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [clerkUser] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!clerkUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const user = userFromClerkUser(clerkUser as UserWithUsername);

      return user;
    }),
});
