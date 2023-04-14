import { HttpStatus as CoreHttpStatus } from "@nestjs/common";

enum HttpStatusNew {
    RESOURCE_LOCKED = 423
}


export const HttpStatus = { ...HttpStatusNew, ...CoreHttpStatus };
export type HttpStatus = typeof HttpStatus;