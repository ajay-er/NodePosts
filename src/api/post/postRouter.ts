import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { postService } from '@/api/post/postService';
import configurePassport from '@/common/middleware/passport';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { User } from '../user/userModel';
import { Post, PostParamsSchema } from './postModel';

export const postRouter: Router = (() => {
  const router = express.Router();

  configurePassport(passport);
  router.use(passport.authenticate('jwt', { session: false }));

  router.get('/', async (req: Request, res: Response) => {
    const user = req?.user as User;
    const serviceResponse = await postService.getAll(user.id);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/:id', validateRequest(PostParamsSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await postService.getById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', async (req: Request, res: Response) => {
    const post = req.body;
    const serviceResponse = await postService.create(post);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', validateRequest(PostParamsSchema), async (req: Request, res: Response) => {
    const body = req.body as Post;
    const serviceResponse = await postService.update(body);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', validateRequest(PostParamsSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await postService.delete(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/location', async (req: Request, res: Response) => {
    const { latitude, longitude } = req.query;
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const serviceResponse = await postService.getPostByLocation(lat, lon);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/status-metrics', async (req: Request, res: Response) => {
    const serviceResponse = await postService.getCount();
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
