import { InternalServerErrorException } from "@nestjs/common";

export type CustoExceptionType = InternalServerErrorException & {
    type: string;
}