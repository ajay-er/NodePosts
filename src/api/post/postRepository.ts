import { CountResponse, Post, PostModel } from './postModel';

export const postRepository = {
  findAll: async (id: string): Promise<Post[] | null> => {
    return await PostModel.find({ createdBy: id });
  },
  findById: async (id: string, userId: string): Promise<Post | null> => {
    return await PostModel.findOne({ _id: id, createdBy: userId });
  },
  create: async (body: Post): Promise<any | null> => {
    return await PostModel.create(body);
  },
  update: async (body: Post, userId: string): Promise<any | null> => {
    return await PostModel.updateOne({ _id: body.id, createdBy: userId }, { $set: body });
  },
  delete: async (id: string, userId: string): Promise<any | null> => {
    return await PostModel.deleteOne({ _id: id, createdBy: userId });
  },
  findByLocation: async (lat: number, lon: number): Promise<Post[] | null> => {
    return await PostModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lat, lon],
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
