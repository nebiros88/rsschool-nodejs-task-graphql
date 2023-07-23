import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

type FastifyInstanceType = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export const resolvers = {
  Query: {
    users: async (contextValue: FastifyInstanceType) => {
      console.log('USERS - ');
      const { prisma } = contextValue;
      await prisma.user.findMany().then((result) => result);
    },
    memberTypes: async (contextValue: FastifyInstanceType) => {
      console.log('MEMBERTYPE - 1');
      const { prisma } = contextValue;
      const result = await prisma.memberType.findMany();
      console.log('MEMBERTYPE - 2', result);
      return result;
    },
  },
};
