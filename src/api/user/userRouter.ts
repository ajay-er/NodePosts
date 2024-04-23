import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { UserSchema } from './userModel';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'get',
    path: '/api/v1/users/register',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get('/register', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.register();
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/api/v1/users/login',
    tags: ['User'],
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/login', async (req: Request, res: Response) => {
    const serviceResponse = await userService.login();
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
