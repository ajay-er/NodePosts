import { User, UserModel } from './userModel';

export const userRepository = {
  create: async (user: User): Promise<User | null> => {
    return await UserModel.create({ ...user });
  },
  find: async (email: string): Promise<User | null> => {
    return UserModel.findOne({ email });
  },
};
