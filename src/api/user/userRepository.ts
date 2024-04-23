import { User } from './userModel';

export const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Bob', email: 'bob@example.com', createdAt: new Date(), updatedAt: new Date() },
];

export const userRepository = {
  register: async (): Promise<User | null> => {
    return Promise.resolve(users[1]);
  },

  login: async (): Promise<User | null> => {
    return Promise.resolve(users[1]);
  },
};
