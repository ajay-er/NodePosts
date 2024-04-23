import mongoose from 'mongoose';
import { z } from 'zod';

export const commonValidations = {
  id: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
};
