import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { CountResponse, Post } from './postModel';
import { postRepository } from './postRepository';

export const postService = {
  getAll: async (id: string): Promise<ServiceResponse<Post[] | null>> => {
    try {
      const posts = await postRepository.findAll(id);
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
  getById: async (id: string, userId: string): Promise<ServiceResponse<Post | null>> => {
    try {
      const post = await postRepository.findById(id, userId);
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
  create: async (body: Post): Promise<ServiceResponse<Post | null>> => {
    try {
      const post = await postRepository.create(body);
      if (!post) {
        return new ServiceResponse(ResponseStatus.Failed, 'post creation failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Post>(ResponseStatus.Success, 'post created', post, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  update: async (body: Post, userId: string): Promise<ServiceResponse<Post | null>> => {
    try {
      const post = await postRepository.update(body, userId);
      if (!post) {
        return new ServiceResponse(ResponseStatus.Failed, 'post updation failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Post>(ResponseStatus.Success, 'post updated', post, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  delete: async (id: string, userId: string): Promise<ServiceResponse<Post | null>> => {
    try {
      const post = await postRepository.delete(id, userId);
      if (!post) {
        return new ServiceResponse(ResponseStatus.Failed, 'post deletion failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Post>(ResponseStatus.Success, 'post deleted', post, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getPostByLocation: async (latitude: number, longitude: number): Promise<ServiceResponse<Post[] | null>> => {
    try {
      const posts = await postRepository.findByLocation(latitude, longitude);
      if (!posts) {
        return new ServiceResponse(ResponseStatus.Failed, 'post deletion failed', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Post[]>(ResponseStatus.Success, 'post deleted', posts, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getPostsByLocation: async (latitude: number, longitude: number): Promise<ServiceResponse<Post[] | null>> => {
    try {
      const posts = await postRepository.findByLocation(latitude, longitude);
      if (!posts?.length) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'posts not found! change location',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<Post[]>(ResponseStatus.Success, 'Posts found', posts, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error retrieving posts by location: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getCount: async (): Promise<ServiceResponse<CountResponse | null>> => {
    try {
      const counts = await postRepository.findCount();
      return new ServiceResponse<CountResponse | null>(
        ResponseStatus.Success,
        'counts founded',
        counts,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding posts: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
