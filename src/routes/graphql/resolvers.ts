import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';

export function resolvers(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
) {
  return {
    users: () => {
      return prisma.user.findMany();
    },
    user: async ({ id }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: id as string,
        },
      });
      return user;
    },
    memberTypes: () => {
      return prisma.memberType.findMany();
    },
    memberType: async ({ id }) => {
      const memberType = await prisma.memberType.findUnique({
        where: {
          id: id as string,
        },
      });
      return memberType;
    },
    posts: () => {
      return prisma.post.findMany();
    },
    post: async ({ id }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: id as string,
        },
      });
      return post;
    },
    profiles: () => {
      return prisma.profile.findMany();
    },
    profile: async ({ id }) => {
      const profile = await prisma.profile.findUnique({
        where: {
          id: id as string,
        },
      });
      return profile;
    },
  };
}
