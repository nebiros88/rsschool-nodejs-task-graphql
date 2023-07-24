import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';
import { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

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
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
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
      args: { id: { type: GraphQLString } },
      async resolve(parent, args: { [argName: string]: any }, context: ContextType) {
        const { prisma } = context;
        const post = await prisma.post.findUnique({
          where: {
            id: args.id as string,
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
      args: { id: { type: GraphQLString } },
      async resolve(parent, args: { [argName: string]: any }, context: ContextType) {
        const { prisma } = context;
        const profile = await prisma.profile.findUnique({
          where: {
            id: args.id as string,
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
      args: { id: { type: GraphQLString } },
      async resolve(parent, args: { [argName: string]: any }, context: ContextType) {
        const { prisma } = context;
        const memberType = await prisma.memberType.findUnique({
          where: {
            id: args.id as string,
          },
        });
        return memberType;
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      args: {},
      async resolve(parent, args: { [argName: string]: any }, context: ContextType) {
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
