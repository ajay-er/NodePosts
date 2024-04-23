import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  createdBy: z.string(),
  active: z.boolean(),
  location: z.object({
    type: z.enum(['Point']),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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
