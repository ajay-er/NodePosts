import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

import { UserModel } from '@/api/user/userModel';

import { env } from '../utils/envConfig';

export default function configurePassport(passport: PassportStatic) {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.JWT_SECRET_KEY || 'token',
      },
      async (payload, done) => {
        try {
          const user = await UserModel.findById({ _id: payload?.id });
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}
