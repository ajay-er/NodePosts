import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { User, UserSchema } from './userModel';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'post',
    path: '/api/v1/users/register',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.post('/register', async (req: Request, res: Response) => {
    const user = req.body as User;
    const serviceResponse = await userService.register(user);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'post',
    path: '/api/v1/users/login',
    tags: ['User'],
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.post('/login', async (req: Request, res: Response) => {
    const user = req.body as User;
    const serviceResponse = await userService.login(user);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
