import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';
import { resolvers } from './resolvers.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const { query, variables } = req.body;
      await graphql({
        schema,
        source: query,
        variableValues: variables,
        rootValue: resolvers,
        contextValue: fastify,
      }).then((result) => reply.send({ data: result }));
    },
  });
};

export default plugin;
