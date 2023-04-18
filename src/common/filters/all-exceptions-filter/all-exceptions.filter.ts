import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

import { MongoErrors } from 'src/common/enums';

/**
 * Using dry-kiss for switching between handlers
 */
const codeKeyMaps = {
  '11000': {
    key: 'DuplicateKey',
    statusCode: HttpStatus.CONFLICT,
  },
};

const handlerMethods = {
  MongoServerError: function (exception) {
    const { code, keyPattern, message } = exception as {
      code: number;
      keyPattern: string;
      message: string;
    };

    const toReturn = {
      data: 'Error',
      message,
      /**
       * @note  Default status is either the exception retrieved status code, otherwise INTERNAL_SERVER_ERROR if not present
       */
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const errorObject = codeKeyMaps[code.toString()];

    if (!errorObject) return toReturn;

    const { key: errorKey, statusCode } = errorObject;

    Object.assign(toReturn, {
      message: MongoErrors[errorKey],
      statusCode,
      data: Object.keys(keyPattern).pop(),
    });

    return toReturn;
  },
  default: function (exception) {
    const { message } = exception as { message: string };

    return {
      data: 'Error',
      message,
      /**
       * @note  Default status is either the exception retrieved status code, otherwise INTERNAL_SERVER_ERROR if not present
       */
      statusCode: exception?.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
    };
  },
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception);

    const useResponse = handlerMethods[exception.name]
      ? handlerMethods[exception.name](exception)
      : handlerMethods.default(exception);

    const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR } = useResponse;

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    response.status(statusCode).json({
      ...useResponse,
      statusCode,
    });
  }
}
