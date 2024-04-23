import * as argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { generateToken } from '@/common/utils/jwt';
import { logger } from '@/server';

import { User } from './userModel';

export const userService = {
  register: async (registerData: User): Promise<ServiceResponse<{ user: User; token: string } | null>> => {
    try {
      const userExist = await userRepository.find(registerData.email);
      if (userExist) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User registration failed - User with the same email already exists',
          null,
          StatusCodes.CONFLICT
        );
      }
      const hash = await argon2.hash(registerData.password);
      const user = await userRepository.create({ ...registerData, password: hash });
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Oops user registeration failed',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const token = generateToken({ id: user.id, name: user.name });
      return new ServiceResponse<{ user: User; token: string }>(
        ResponseStatus.Success,
        'User Registeration completed',
        { user, token },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error registering user: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  login: async (userData: Omit<User, 'name'>): Promise<ServiceResponse<{ user: User; token: string } | null>> => {
    try {
      const user = await userRepository.find(userData?.email);
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Please enter valid credentials',
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const isValid = await argon2.verify(user.password, userData.password);
      if (!isValid)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Please enter valid credentials',
          null,
          StatusCodes.BAD_REQUEST
        );
      const token = generateToken({ id: user.id, name: user.name });
      return new ServiceResponse<{ user: User; token: string }>(
        ResponseStatus.Success,
        'User found',
        { user, token },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error login:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
