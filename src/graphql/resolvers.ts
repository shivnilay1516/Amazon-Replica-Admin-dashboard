import { User } from '../../src/types/user';
import { IResolvers } from '@graphql-tools/utils';

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

export const resolvers: IResolvers = {
  Query: {
    hello: () => 'Hello from GraphQL + Next.js + TypeScript!',
    users: () => users,
  },
};
