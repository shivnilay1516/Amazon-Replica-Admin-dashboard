import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '../../../graphql/schema';
import { resolvers } from '../../../graphql/resolvers';
import { NextApiRequest, NextApiResponse } from 'next';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await apolloServer.createHandler({
    path: 'https://7501-103-206-131-194.ngrok-free.app/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
