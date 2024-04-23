import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { Post } from './postModel';
import { postRepository } from './postRepository';

export const postService = {
  getAll: async (): Promise<ServiceResponse<Post[] | null>> => {
    try {
      const posts = await postRepository.find();
      if (!posts?.length) {
        return new ServiceResponse(ResponseStatus.Failed, 'posts not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Post[]>(ResponseStatus.Success, 'posts found', posts, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getById: async (id: number): Promise<ServiceResponse<Post | null>> => {
    try {
      const post = await postRepository.findById(id);
      if (!post) {
        return new ServiceResponse(ResponseStatus.Failed, 'post not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Post>(ResponseStatus.Success, 'post found', post, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
