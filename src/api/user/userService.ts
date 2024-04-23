import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { User } from './userModel';

export const userService = {
  register: async (): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.register();
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Oops', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User Registeration complted', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error registering user: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  login: async (): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.login();
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
