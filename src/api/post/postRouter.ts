import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import passport from 'passport';
import { z } from 'zod';

import { postService } from '@/api/post/postService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import configurePassport from '@/common/middleware/passport';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { User } from '../user/userModel';
import { Post, PostBodySchema, PostParamsSchema, PostQuerySchema, PostSchema } from './postModel';

export const postRegistry = new OpenAPIRegistry();

postRegistry.register('Post', PostSchema);
const bearer = postRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const postRouter: Router = (() => {
  const router = express.Router();

  postRegistry.registerPath({
    method: 'get',
    path: '/api/v1/posts/location',
    tags: ['Post'],
    request: {
      query: PostQuerySchema,
    },
    responses: createApiResponse(z.array(PostSchema), 'Success'),
  });
  router.get('/location', validateRequest(PostQuerySchema), async (req: Request, res: Response) => {
    const { latitude, longitude } = req.query;
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const serviceResponse = await postService.getPostByLocation(lat, lon);
    handleServiceResponse(serviceResponse, res);
  });

  postRegistry.registerPath({
    method: 'get',
    path: '/api/v1/posts/status-metrics',
    tags: ['Post'],
    responses: createApiResponse(z.array(z.object({ active: z.number(), inactive: z.number() })), 'Success'),
  });
  router.get('/status-metrics', async (_req: Request, res: Response) => {
    const serviceResponse = await postService.getCount();
    handleServiceResponse(serviceResponse, res);
  });

  configurePassport(passport);
  router.use(passport.authenticate('jwt', { session: false }));

  postRegistry.registerPath({
    method: 'get',
    path: '/api/v1/posts',
    tags: ['Post'],
    security: [{ [bearer.name]: [] }],
    responses: createApiResponse(z.array(PostSchema), 'Success'),
  });
  router.get('/', async (req: Request, res: Response) => {
    const user = req?.user as User;
    const serviceResponse = await postService.getAll(user.id);
    handleServiceResponse(serviceResponse, res);
  });

  postRegistry.registerPath({
    method: 'get',
    path: '/api/v1/posts/{id}',
    tags: ['Post'],
    request: {
      params: PostParamsSchema.shape.params,
    },
    security: [{ [bearer.name]: [] }],
    responses: createApiResponse(z.array(PostSchema), 'Success'),
  });
  router.get('/:id', validateRequest(PostParamsSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req?.user as User;
    const serviceResponse = await postService.getById(id, user.id);
    handleServiceResponse(serviceResponse, res);
  });

  postRegistry.registerPath({
    method: 'post',
    path: '/api/v1/posts',
    tags: ['Post'],
    security: [{ [bearer.name]: [] }],
    request: {
      body: {
        description: 'post new content here!',
        content: {
          'application/json': {
            schema: PostBodySchema,
            example: {
              title: 'Example Post',
              body: 'content goes here.',
              location: {
                type: 'Point',
                coordinates: [18.7128, -24.006],
              },
            },
          },
        },
        required: true,
      },
    },
    responses: createApiResponse(z.array(PostSchema), 'Success'),
  });
  router.post('/', validateRequest(PostBodySchema), async (req: Request, res: Response) => {
    const post = req.body as Post;
    const user = req?.user as User;
    post.createdBy = user.id;
    const serviceResponse = await postService.create(post);
    handleServiceResponse(serviceResponse, res);
  });

  postRegistry.registerPath({
    method: 'put',
    path: '/api/v1/posts/{id}',
    tags: ['Post'],
    security: [{ [bearer.name]: [] }],
    request: {
      params: PostParamsSchema.shape.params,
      body: {
        description: 'post update here!',
        content: {
          'application/json': {
            schema: PostBodySchema,
            example: {
              title: 'Example Post update',
              body: 'content goes here.',
              location: {
                type: 'Point',
                coordinates: [18.7128, -24.006],
              },
            },
          },
        },
      },
    },
    responses: createApiResponse(z.array(PostSchema), 'Success'),
  });
  router.put('/:id', validateRequest(PostParamsSchema), async (req: Request, res: Response) => {
    const body = req.body as Post;
    body.id = req.params.id;
    const user = req.user as User;
    const serviceResponse = await postService.update(body, user.id);
    handleServiceResponse(serviceResponse, res);
  });

  postRegistry.registerPath({
    method: 'delete',
    path: '/api/v1/posts/{id}',
    tags: ['Post'],
    request: {
      params: PostParamsSchema.shape.params,
    },
    security: [{ [bearer.name]: [] }],
    responses: createApiResponse(z.array(PostSchema), 'Success'),
  });
  router.delete('/:id', validateRequest(PostParamsSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req?.user as User;
    const serviceResponse = await postService.delete(id, user.id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
