import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  name: z.string().trim().min(3, { message: 'name must be at least 3 characters long' }),
  email: z.string().trim().email({ message: 'Invalid email format' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
  id: z.string().optional(),
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

export const UserLoginSchema = z.object({ body: UserSchema.omit({ name: true, id: true }) });
export const UserRegisterSchema = z.object({
  body: UserSchema,
});
