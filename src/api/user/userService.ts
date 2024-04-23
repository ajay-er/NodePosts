import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { User } from './userModel';

export const userService = {
  register: async (registerData: User): Promise<ServiceResponse<User | null>> => {
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
      const user = await userRepository.create(registerData);
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Oops user registeration failed',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User Registeration completed', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error registering user: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  login: async (userData: Omit<User, 'name'>): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.find(userData?.email);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error login:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
