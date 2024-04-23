import express, { Request, Response, Router } from 'express';

import { postService } from '@/api/post/postService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

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

  return router;
})();
