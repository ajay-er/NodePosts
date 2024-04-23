import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export const PostSchema = z.object({
  id: z.string().min(1, 'ID must be a positive number'),
  title: z
    .string({ invalid_type_error: 'invalid title type', required_error: 'title is required' })
    .min(1, 'Title must not be empty'),
  body: z
    .string({ invalid_type_error: 'invalid body type', required_error: 'body is required' })
    .min(1, 'Body must not be empty'),
  createdBy: z.string().optional(),
  active: z.boolean().default(true).optional(),
  location: z.object({
    type: z.enum(['Point']),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

const postMongooseSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

export type CountResponse = {
  active: number;
  inactive: number;
};

export const PostModel = mongoose.model('Post', postMongooseSchema);
export type Post = z.infer<typeof PostSchema>;

export const PostParamsSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const PostBodySchema = z.object({
  body: PostSchema.omit({ id: true }),
});
