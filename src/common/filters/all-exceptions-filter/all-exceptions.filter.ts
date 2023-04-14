import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException
} from "@nestjs/common";

import { MongoErrors } from 'src/common/enums';



/**
 * Using dry-kiss for switching between handlers
 */
const codeKeyMaps = {
  '11000': 'DuplicateKey',
}

const handlerMethods = {
  MongoServerError: function (exception) {
    const { code, keyPattern, message } = exception as { code: number, keyPattern: string, message: string };

    const toReturn = {
      data: 'Error',
      message,
    }

    const errorKey = codeKeyMaps[code.toString()];

    if (!errorKey)
      return toReturn;

    toReturn.data = Object
      .keys(keyPattern)
      .pop();

    toReturn.message = MongoErrors[errorKey];

    return toReturn;
  },
  default: function (exception) {
    const { message } = exception as { message: string };

    return {
      data: 'Error',
      message,
    }
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(
    exception: InternalServerErrorException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception);

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;


    const useResponse = handlerMethods[exception.name]
      ? handlerMethods[exception.name](exception)
      : handlerMethods.default(exception)


    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    response
      .status(statusCode)
      .json({
        ...useResponse,
        statusCode
      });
  }
}