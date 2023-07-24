import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { Post } from '@prisma/client';
import { UUIDType } from './types/uuid.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

type ContextType = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType as GraphQLObjectType,
      async resolve({ id }, args, context: ContextType) {
        const { prisma } = context;
        const profile = await prisma.profile.findUnique({
          where: {
            userId: id as string,
          },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve({ id }: Post, args: unknown, context: ContextType) {
        const { prisma } = context;
        const posts = await prisma.post.findMany({
          where: {
            authorId: id,
          },
        });
        return posts;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      async resolve({ id }, args: unknown, context: ContextType) {
        const { prisma } = context;
        const userSubscribedTo = await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id as string,
              },
            },
          },
        });
        return userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      async resolve({ id }, args: unknown, context: ContextType) {
        const { prisma } = context;
        const subscribedToUser = await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id as string,
              },
            },
          },
        });
        return subscribedToUser;
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: MemberTypeType,
      async resolve({ memberTypeId }, args, context: ContextType) {
        const { prisma } = context;
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: memberTypeId as string,
          },
        });
        return memberType;
      },
    },
  }),
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: UUIDType } },
      async resolve(parent, args: { [argName: string]: any }, context: ContextType) {
        const { prisma } = context;
        const user = await prisma.user.findUnique({
          where: {
            id: args.id as string,
          },
        });
        return user;
      },
    },

    users: {
      type: new GraphQLList(UserType),
      args: {},
      async resolve(parent, args, context: ContextType) {
        const { prisma } = context;
        const users = await prisma.user.findMany();
        return users;
      },
    },

    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      async resolve(parent, { id }, context: ContextType) {
        const { prisma } = context;
        const post = await prisma.post.findUnique({
          where: {
            id: id as string,
          },
        });
        return post;
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      args: {},
      async resolve(parent, args, context: ContextType) {
        const { prisma } = context;
        const posts = await prisma.post.findMany();
        return posts;
      },
    },

    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      async resolve(parent, { id }, context: ContextType) {
        const { prisma } = context;
        const profile = await prisma.profile.findUnique({
          where: {
            id: id as string,
          },
        });
        return profile;
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      args: {},
      async resolve(parent, args, context: ContextType) {
        const { prisma } = context;
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },

    memberType: {
      type: MemberTypeType,
      args: { id: { type: MemberTypeId } },
      async resolve(parent, { id }, context: ContextType) {
        const { prisma } = context;
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: id as string,
          },
        });
        return memberType;
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      args: {},
      async resolve(parent, args, context: ContextType) {
        const { prisma } = context;
        const memberTypes = await prisma.memberType.findMany();
        return memberTypes;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
