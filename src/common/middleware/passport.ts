import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

import { User, UserModel } from '@/api/user/userModel';

import { env } from '../utils/envConfig';

export default (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.JWT_SECRET_KEY || 'token',
      },
      (payload, done) => {
        UserModel.findOne({ id: payload.id }, function (err: any, user: User) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );
};
