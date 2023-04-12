import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Authorization, GetCurrentUser, Public } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { UserDto } from '../users/dto';
import { UserSafeType } from '../users/types/users-safe.type';

import { AuthService } from './auth.service';
import { GenerateOtpDto, LoginDto, VerifyOtpDto } from './dto';
import { JwtRefreshAuthGuard } from './guards';
import { SafeUserTokenType, Tokens } from './types';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async userSignUp(
    @Body()
    userDto: UserDto,
  ): Promise<SafeUserTokenType> {
    return this.authService.userSignUp(userDto);
  }

  @Public()
  @Post('signup/admin')
  @HttpCode(HttpStatus.CREATED)
  async adminSignUp(
    @Body()
    adminDto: UserDto,
  ): Promise<SafeUserTokenType> {
    return this.authService.adminSignUp(adminDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(
    @Body()
    userDto: LoginDto,
  ): Promise<SafeUserTokenType> {
    return this.authService.userLogin(userDto);
  }

  @Public()
  @Post('login/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogin(
    @Body()
    adminDto: LoginDto,
  ): Promise<SafeUserTokenType> {
    return this.authService.adminLogin(adminDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async userLogout(
    @Req()
    req: Request,
    @GetCurrentUser('_id')
    userId: string,
  ): Promise<void> {
    const token = req.headers['authorization'].replace('Bearer ', '').trim();

    return this.authService.userLogout(userId, token);
  }

  @Authorization(Role.Admin, Role.SuperAdmin)
  @Post('logout/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogout(
    @Req()
    req: Request,
    @GetCurrentUser('_id')
    userId: string,
  ): Promise<void> {
    const token = req.headers['authorization'].replace('Bearer ', '').trim();
    return this.authService.adminLogout(userId, token);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async userRefreshTokens(
    @GetCurrentUser('_id')
    userId: string,
    @GetCurrentUser('refreshToken')
    refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshUserTokens(userId, refreshToken);
  }

  @Public()
  @Authorization(Role.Admin, Role.SuperAdmin)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh/admin')
  @HttpCode(HttpStatus.OK)
  async adminRefreshTokens(
    @GetCurrentUser('_id')
    userId: string,
    @GetCurrentUser('refreshToken')
    refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshAdminTokens(userId, refreshToken);
  }

  // @Public()
  // @Post('otp/generate')
  // @HttpCode(HttpStatus.OK)
  // async generateUserOtp(@Body() dto: GenerateOtpDto) {
  //   return this.authService.generateUserOtp(dto);
  // }

  // @Post('otp/generate/admin')
  // @HttpCode(HttpStatus.OK)
  // async generateAdminOTP() {
  //   return this.authService.generateAdminOtp();
  // }

  //* This is used to verify otp for user signup process only *//

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyUserOtp(
    @Body()
    verifyOtpDto: VerifyOtpDto,
  ): Promise<UserSafeType> {
    return this.authService.verifyUserOtp(verifyOtpDto);
  }

  //* This is used to verify otp for admin signup process only *//

  @Authorization(Role.Admin, Role.SuperAdmin)
  @Post('otp/verify/admin')
  @HttpCode(HttpStatus.OK)
  async verifyAdminOtp(
    @Body()
    verifyOtpDto: VerifyOtpDto,
  ): Promise<UserSafeType> {
    return this.authService.verifyAdminOtp(verifyOtpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotUserPassword(
    @Body()
    generateOtpDto: GenerateOtpDto,
  ): Promise<void> {
    return this.authService.forgotUserPassword(generateOtpDto);
  }

  @Post('forgot-password/admin')
  @HttpCode(HttpStatus.OK)
  async forgotAdminPassword(
    @Body()
    generateOtpDto: GenerateOtpDto,
  ): Promise<void> {
    return this.authService.forgotAdminPassword(generateOtpDto);
  }

  //* This is used to verify otp throughout the application *//

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body()
    verifyOtpDto: VerifyOtpDto,
  ): Promise<void> {
    return this.authService.validateOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(
    @Body()
    resendOtpDto: ResendOtpDto,
  ): Promise<void> {
    return this.authService.generateOtp(resendOtpDto);
  }
}
