import { Type } from '@fastify/type-provider-typebox';
import { buildSchema } from 'graphql';

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

export const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    balance: Int!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
  }

  type Profile {
    id: ID!
    isMale: Boolean!
    yearOfBirth: Int!
  }

  type MemberType {
    id: ID!
    discount: Float!
    postsLimitPerMonth: Int!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    memberTypes: [MemberType]
    memberType(id: ID!): MemberType
    posts: [Post]
    post(id: ID!): Post
    profiles: [Profile]
    profile(id: ID!): Profile
  }
`);
