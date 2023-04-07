import {
  ForbiddenException,
  GoneException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  checkIfAdmin,
  compareHashed,
  generateUUID,
  hashData,
  randomNumberGenerator,
} from 'src/utilities';
import { UserDto } from '../users/dto';
import { UserType } from '../users/types';
import { UsersService } from '../users/users.service';
import { LoginDto, VerifyOtpDto } from './dto';
import { GenerateOtpType, SafeUserTokenType, Tokens, VerifyOtpType } from './types';
import * as dotenv from 'dotenv';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';
import { InjectModel } from '@nestjs/mongoose';
import {
  ExpiredToken,
  ExpiredTokenDocument,
} from 'src/database/mongoose/schemas/expired-token.schema';
import { Model } from 'mongoose';
import { CacheService } from '../cache/cache.service';
import { MailerService } from '../mailer/mailer.service';
import { Constants } from 'src/common/constants';
import { UserSafeType } from '../users/types/users-safe.type';

dotenv.config();

const { JWT_SECRET_ACCESS_TOKEN_KEY, JWT_SECRET_REFRESH_TOKEN_KEY, OTP_LENGTH } =
  process.env as EnvironmentVariables;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly cacheService: CacheService,
    @InjectModel(ExpiredToken.name)
    private readonly expiredTokenModel: Model<ExpiredTokenDocument>,
  ) {}

  async userLogin(userDto: LoginDto): Promise<SafeUserTokenType> {
    const user = await this.validateUser(userDto.username, userDto.password);
    if (!user) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const tokens = await this.getTokensAndUpdateRtHash(user, Constants.USER);

    const { password, ...responseUser } = user;

    return {
      user: responseUser,
      tokens,
    };
  }

  async adminLogin(adminDto: LoginDto): Promise<SafeUserTokenType> {
    const user = await this.validateAdmin(adminDto.username, adminDto.password);
    if (!user) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const tokens = await this.getTokensAndUpdateRtHash(user, Constants.ADMIN);

    const { password, ...responseUser } = user;

    return {
      user: responseUser,
      tokens,
    };
  }

  async userSignUp(userDto: UserDto): Promise<{ user: UserSafeType; tokens: Tokens }> {
    /** If user is guest generate random id for user and return tokens */
    if (userDto.is_guest) {
      userDto.username = generateUUID();
      const createdUser = await this.usersService.createUser(userDto);
      const tokens = await this.getTokensAndUpdateRtHash(createdUser, Constants.USER);

      const { password, ...responseUser } = createdUser;

      return {
        user: responseUser,
        tokens,
      };
    }

    /** If user is not guest check if user exist, if exist throw error else create new user */
    const user = await this.usersService.findUserByUsername(userDto.username);
    if (user) throw new ForbiddenException(Constants.ErrorMessages.USER_USERNAME_ALREADY_EXIST);

    const hashedPassword = await hashData(userDto.password);
    userDto.password = hashedPassword;
    const createdUser = await this.usersService.createUser(userDto);

    await this.generateOtp({ email: userDto.email });

    const tokens = await this.getTokensAndUpdateRtHash(createdUser, Constants.USER);

    const { password, ...responseUser } = createdUser;

    return {
      user: responseUser,
      tokens,
    };
  }

  async adminSignUp(adminDto: UserDto): Promise<{ user: UserSafeType; tokens: Tokens }> {
    const isAdminRole = checkIfAdmin(adminDto.roles);

    if (!isAdminRole) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const admin = await this.usersService.findAdminUserByUsername(adminDto.username);

    if (admin) throw new ForbiddenException(Constants.ErrorMessages.ADMIN_USERNAME_ALREADY_EXIST);

    const hashedPassword = await hashData(adminDto.password);
    adminDto.password = hashedPassword;
    const createdUser = await this.usersService.createAdminUser(adminDto);

    const tokens = await this.getTokensAndUpdateRtHash(createdUser, Constants.ADMIN);

    await this.generateOtp({ email: createdUser.email });

    const { password, ...responseUser } = createdUser;
    return {
      user: responseUser,
      tokens,
    };
  }

  async userLogout(userId: string, token: string): Promise<void> {
    const expiredToken = new this.expiredTokenModel({ expired_token: token });
    await expiredToken.save();
    return this.usersService.logoutUser(userId);
  }

  async adminLogout(userId: string, token: string): Promise<void> {
    const expiredToken = new this.expiredTokenModel({ expired_token: token });
    await expiredToken.save();
    return this.usersService.logoutAdminUser(userId);
  }

  async refreshUserTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.hashed_rt)
      throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const rtMatches = await compareHashed(rt, user.hashed_rt);
    if (!rtMatches) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const tokens = await this.getTokensAndUpdateRtHash(user, Constants.USER);
    return tokens;
  }

  async refreshAdminTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersService.findAdminUserById(userId);
    if (!user || !user.hashed_rt)
      throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const rtMatches = await compareHashed(rt, user.hashed_rt);
    if (!rtMatches) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);

    const tokens = await this.getTokensAndUpdateRtHash(user, Constants.ADMIN);
    return tokens;
  }

  async generateOtp(dto: GenerateOtpType) {
    const otpLength = Number(OTP_LENGTH);
    const otp = randomNumberGenerator(otpLength);
    this.cacheService.set(dto.email, {
      otp,
      otpRetries: 0,
    });

    await this.mailerService.sendEmail(dto.email, Constants.EMAIL_SUBJECT, otp);
    return otp;
  }

  //** Will be removed */
  // async generateAdminOtp() {
  //   return null;
  // }

  async verifyUserOtp(verifyOtpDto: VerifyOtpDto): Promise<UserSafeType> {
    const { email, otp } = verifyOtpDto;
    const getOtpDetails: VerifyOtpType = await this.cacheService.get(email);
    if (!getOtpDetails) {
      throw new NotAcceptableException(Constants.ErrorMessages.INVALID_EMAIL);
    }
    if (otp === getOtpDetails.otp) {
      this.cacheService.delete(email);
      const updatedUser = await this.usersService.findUserByEmailAndUpdate(email, {
        is_verified: true,
      });
      return updatedUser;
    } else {
      getOtpDetails.otpRetries = getOtpDetails.otpRetries + 1;
      this.cacheService.set(email, getOtpDetails);
      if (getOtpDetails.otpRetries === 3) {
        this.cacheService.delete(email);
        throw new GoneException(Constants.ErrorMessages.OTP_EXPIRED);
      } else {
        throw new NotAcceptableException(Constants.ErrorMessages.INCORRECT_OTP);
      }
    }
  }

  async verifyAdminOtp(verifyOtpDto: VerifyOtpDto): Promise<UserSafeType> {
    const { email, otp } = verifyOtpDto;
    const getOtpDetails: VerifyOtpType = await this.cacheService.get(email);
    if (!getOtpDetails) {
      throw new NotAcceptableException(Constants.ErrorMessages.INVALID_EMAIL);
    }
    if (otp === getOtpDetails.otp) {
      this.cacheService.delete(email);
      const updatedAdmin = await this.usersService.findAdminByEmailAndUpdate(email, {
        is_verified: true,
      });
      return updatedAdmin;
    } else {
      getOtpDetails.otpRetries = getOtpDetails.otpRetries + 1;
      this.cacheService.set(email, getOtpDetails);
      if (getOtpDetails.otpRetries === 3) {
        this.cacheService.delete(email);
        throw new GoneException(Constants.ErrorMessages.OTP_EXPIRED);
      } else {
        throw new NotAcceptableException(Constants.ErrorMessages.INCORRECT_OTP);
      }
    }
  }

  async validateUser(username: string, pass: string): Promise<UserType | null> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException('No User Found');
    const passwordMatches = await compareHashed(pass, user.password);

    if (!passwordMatches) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);
    return user;
  }

  async validateAdmin(username: string, pass: string): Promise<UserType | null> {
    const user = await this.usersService.findAdminUserByUsername(username);
    if (!user) throw new NotFoundException(Constants.ErrorMessages.NO_USER_FOUND);
    const passwordMatches = await compareHashed(pass, user.password);

    if (!passwordMatches) throw new ForbiddenException(Constants.ErrorMessages.ACCESS_DENIED);
    return user;
  }

  async getTokensAndUpdateRtHash(user: UserType, role: string): Promise<Tokens> {
    const { username, _id, roles } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
          _id,
          roles,
        },
        { secret: JWT_SECRET_ACCESS_TOKEN_KEY, expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        {
          username,
          _id,
          roles,
        },
        {
          secret: JWT_SECRET_REFRESH_TOKEN_KEY,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    if (role === Constants.USER) {
      await this.usersService.updateUserRtHash(_id, refreshToken);
    }

    if (role === Constants.ADMIN) {
      await this.usersService.updateAdminRtHash(_id, refreshToken);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
