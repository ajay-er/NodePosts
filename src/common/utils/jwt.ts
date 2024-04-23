import * as jwt from 'jsonwebtoken';

import { env } from './envConfig';

export const generateToken = (payload: any) => {
  return jwt.sign(payload, env.JWT_SECRET_KEY, { expiresIn: env.JWT_EXPIRE });
};
