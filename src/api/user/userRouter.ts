import express, { Request, Response, Router } from 'express';

import { userService } from '@/api/user/userService';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { User, UserLoginSchema, UserRegisterSchema } from './userModel';

export const userRouter: Router = (() => {
  const router = express.Router();

  router.post('/register', validateRequest(UserRegisterSchema), async (req: Request, res: Response) => {
    const user = req.body as User;
    const serviceResponse = await userService.register(user);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/login', validateRequest(UserLoginSchema), async (req: Request, res: Response) => {
    const user = req.body as User;
    const serviceResponse = await userService.login(user);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
