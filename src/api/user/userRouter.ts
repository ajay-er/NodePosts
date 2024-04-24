import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { User, UserLoginSchema, UserRegisterSchema, UserSchema } from './userModel';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'post',
    path: '/api/v1/users/register',
    tags: ['User'],
    request: {
      body: {
        description: 'register new user here',
        content: {
          'application/json': {
            schema: UserRegisterSchema,
            example: {
              name: 'user',
              email: 'user@example.com',
              password: '1234',
            },
          },
        },
        required: true,
      },
    },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post('/register', validateRequest(UserRegisterSchema), async (req: Request, res: Response) => {
    const user = req.body as User;
    const serviceResponse = await userService.register(user);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'post',
    path: '/api/v1/users/login',
    tags: ['User'],
    request: {
      body: {
        description: 'login user here',
        content: {
          'application/json': {
            schema: UserLoginSchema,
            example: {
              email: 'user@example.com',
              password: '1234',
            },
          },
        },
        required: true,
      },
    },
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post('/login', validateRequest(UserLoginSchema), async (req: Request, res: Response) => {
    const user = req.body as User;
    const serviceResponse = await userService.login(user);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
