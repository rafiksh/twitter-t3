# Twitter Clone using create-t3-app Next.js application with trpc and Prisma

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Introduction

This is a Twitter clone built using create-t3-app Next.js application with trpc and Prisma. The application is designed to replicate some of the key features of Twitter, including posting tweets, following and unfollowing users, and liking and retweeting tweets.

## Getting Started

### Prerequisites

Before getting started with this project, you will need to have the following installed:

- Node.js (version 14 or higher)
- Yarn (version 1.22 or higher)
- PostgreSQL

### Installation

1. Clone this repository.
2. Install dependencies by running `yarn install`.
3. Create a new database in PostgreSQL.
4. Create a `.env` file based on the `.env.example` file and set the appropriate environment variables.
5. Run database migrations by running `yarn prisma migrate dev`.
6. Start the development server by running `yarn dev`.

## Features

The Twitter clone includes the following features:

- User authentication using Clerk
- Rate limiting using Upstash Redis
- Posting tweets
- Following and unfollowing users
- Liking and retweeting tweets

## Environment Variables

The following environment variables are used in this application:

- `DATABASE_URL`: The URL of your PostgreSQL database.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: The publishable key for Clerk authentication.
- `CLERK_SECRET_KEY`: The secret key for Clerk authentication.
- `UPSTASH_REDIS_REST_URL`: The URL for the Upstash Redis rate limiter.
- `UPSTASH_REDIS_REST_TOKEN`: The token for the Upstash Redis rate limiter.

## Built With

- Next.js
- trpc
- Prisma
- Clerk
- Upstash Redis
- PlanetScale (for database hosting)

## Conclusion

This Twitter clone is a great starting point for building your own social media application. It includes key features such as user authentication, rate limiting, and posting tweets, and is built using modern web technologies such as Next.js, trpc, and Prisma.
