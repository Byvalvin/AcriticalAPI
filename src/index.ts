import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { typeDefs } from './GQL/typeDefs';
import { resolvers } from './GQL/resolvers';
import connectDB from "./DB/db";

import avatarUploadRouter from './routes/upload'; // 👈 import the route

dotenv.config();

// CONNEC TDB
connectDB();

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

//   app.use(cors(), bodyParser.json());
//   app.use('/GQL', expressMiddleware(apolloServer));
  app.use(
      '/GQL',
      cors(),
      bodyParser.json(),
      expressMiddleware(apolloServer)
  );

  // extra route for uploads
  app.use('/upload-avatar', avatarUploadRouter);

  app.listen(PORT, () => {
    console.log(`🚀 AcriticalAPI running at http://localhost:${PORT}/GQL`);
  });

  console.log('🚀 AcriticalAPI is ready');
}

startServer();