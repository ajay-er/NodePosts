import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const userMongooseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const UserModel = mongoose.model('User', userMongooseSchema);
export type User = z.infer<typeof UserSchema>;
