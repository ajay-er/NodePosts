import { Post, PostModel } from './postModel';

export const postRepository = {
  find: async (): Promise<Post[] | null> => {
    return await PostModel.find();
  },
  findById: async (id: number): Promise<Post | null> => {
    return await PostModel.findById(id);
  },
};
