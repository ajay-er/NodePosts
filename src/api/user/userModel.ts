import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const userMongooseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userMongooseSchema);
export type User = z.infer<typeof UserSchema>;
