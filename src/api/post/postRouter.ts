import express, { Request, Response, Router } from 'express';

import { postService } from '@/api/post/postService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { Post } from './postModel';

export const postRouter: Router = (() => {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    const serviceResponse = await postService.getAll();
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await postService.getById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', async (req: Request, res: Response) => {
    const post = req.body;
    const serviceResponse = await postService.create(post);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const body = req.body as Post;
    const serviceResponse = await postService.update(body);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await postService.delete(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
