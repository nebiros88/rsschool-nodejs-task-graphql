import { GraphQLObjectType, GraphQLList } from 'graphql';
import { ContextType } from './schemas.js';
import { MemberTypeType, MemberTypeId } from './types/memberType-type.js';
import { PostType } from './types/post-type.js';
import { ProfileType } from './types/profile-type..js';
import { UserType } from './types/user-type.js';
import { UUIDType } from './types/uuid.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: UUIDType } },
      async resolve(parent, { id }, context: ContextType) {
        const { prisma } = context;
        const user = await prisma.user.findUnique({
          where: {
            id: id as string,
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
