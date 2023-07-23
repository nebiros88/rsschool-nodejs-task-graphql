import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';

export function resolvers(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
) {
  return {
    users: () => {
      return prisma.user.findMany();
    },
    memberTypes: () => {
      return prisma.memberType.findMany();
    },
  };
}
