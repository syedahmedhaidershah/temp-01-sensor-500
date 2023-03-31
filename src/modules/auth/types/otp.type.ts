export type GenerateOtpType = {
  email: string;
};

export type VerifyOtpType = {
  otpRetries: number;
  otp: number;
};
