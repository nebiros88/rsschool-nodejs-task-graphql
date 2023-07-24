import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { ContextType } from '../schemas.js';
import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberType-type.js';

export const ProfileType = new GraphQLObjectType({
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
