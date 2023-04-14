import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { CacheService } from 'src/modules/cache/cache.service';

@Injectable()
export class UserLockInterceptor implements NestInterceptor {
  private readonly MAX_LOGIN_ATTEMPTS = 3;
  private readonly LOCKOUT_MINUTES = 2;

  constructor(private readonly cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { username } = request.body;

    const key = `login_attempts:${username}`;
    const loginAttempts = parseInt((await this.cacheService.get(key)) ?? '0', 10);

    // if (loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
    //   const lockoutKey = `lockout:${username}`;
    //   const lockoutDatetime = await this.redisService.get(lockoutKey);

    //   if (lockoutDatetime && isAfter(new Date(), new Date(lockoutDatetime))) {
    //     await this.redisService.del(key, lockoutKey);
    //   } else {
    //     throw new Error('Too many failed login attempts');
    //   }
    // }

    // if (this.validatePassword(password)) {
    //   await this.redisService.del(key);

    return next.handle();
    // } else {
    //   await this.redisService.incr(key);

    //   if (loginAttempts + 1 >= this.MAX_LOGIN_ATTEMPTS) {
    //     const lockoutKey = `lockout:${username}`;
    //     const lockoutDatetime = addMinutes(new Date(), this.LOCKOUT_MINUTES).toISOString();

    //     await this.redisService.set(lockoutKey, lockoutDatetime, 'EX', this.LOCKOUT_MINUTES * 60);
    //   }

    //   return throwError('Invalid credentials');
  }
}
