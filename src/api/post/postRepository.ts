import { CountResponse, Post, PostModel } from './postModel';

export const postRepository = {
  find: async (): Promise<Post[] | null> => {
    return await PostModel.find();
  },
  findById: async (id: number): Promise<Post | null> => {
    return await PostModel.findById(id);
  },
  create: async (body: Post): Promise<any | null> => {
    const post = new PostModel(body);
    const savedPost = await post.save();
    return savedPost;
  },
  delete: async (id: number): Promise<any | null> => {
    return await PostModel.findOneAndDelete({ _id: id });
  },
  update: async (body: Post): Promise<any | null> => {
    return await PostModel.findByIdAndUpdate({ _id: body.id }, body);
  },
  findByLocation: async (lat: number, lon: number): Promise<any | null> => {
    return await PostModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
          $maxDistance: 1000,
        },
      },
    });
  },
  findCount: async (): Promise<CountResponse | null> => {
    const active = await PostModel.find({ active: true }).countDocuments();
    const inactive = await PostModel.find({ active: false }).countDocuments();
    return { active: active || 0, inactive: inactive || 0 };
  },
};
