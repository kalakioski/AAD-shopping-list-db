import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { resolvers } from './resolvers';
import { connectToMongo } from './utils/mongo';
import { verifyJwt } from './utils/jwt';
import { User } from './schema/user.schema';
import Context from './types/context';

dotenv.config();

async function bootstrap() {
  // Build the schema

  const schema = await buildSchema({
    resolvers,
    // authChecker,
  });

  // Init express

  const app = express();

  app.use(cookieParser());

  // Create the apollo server
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;

      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);

        context.user = user;
      }
      return context;
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();

  // apply middleware to server
  server.applyMiddleware({ app });

  // app.listen on express server
  app.listen({ port: 4000 }, () => {
    console.log('App is listening on http://localhost:4000');
  });
  connectToMongo();
}

bootstrap();