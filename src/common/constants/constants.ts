export const Constants = {
  JwtStrategyConstants: {
    JWT: 'jwt',
    JWT_REFRESH: 'jwt-refresh',
  },
  MetaData: {
    PUBLIC: 'isPublic',
  },
  Roles: {
    ADMIN_USERS: ['superadmin', 'admin'],
    COMMON_USERS: ['user'],
  },
  ErrorMessages: {
    ACCESS_DENIED: 'Access Denied',
    USER_USERNAME_ALREADY_EXIST: 'User with this username already exists',
    ADMIN_USERNAME_ALREADY_EXIST: 'Admin with this username already exists',
    INVALID_EMAIL: 'Invalid email address',
    OTP_EXPIRED: 'OTP Expired',
    INCORRECT_OTP: 'Incorrect OTP provided. Please input correct OTP.',
    NO_USER_FOUND: 'No user found.',
  },
  OmitProperties: {
    PASSWORD: 'password',
  },
  SUCCESS_RESPONSE: 'success',
  ADMIN: 'admin',
  USER: 'user',
  EMAIL_SUBJECT: 'Verify Email Address',
};
