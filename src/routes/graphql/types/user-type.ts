import { Post } from '@prisma/client';
import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ContextType } from '../schemas.js';
import { ProfileType } from './profile-type..js';
import { PostType } from './post-type.js';

export const UserType = new GraphQLObjectType({
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
