export enum PassageErrorCode {
  PasskeyError = 'PASSKEY_ERROR',
  PasskeysNotSupported = 'PASSKEYS_NOT_SUPPORTED',
  UserCancelled = 'USER_CANCELLED',
  UserUnauthorized = 'USER_UNAUTHORIZED',
  ChangeEmailError = 'CHANGE_EMAIL_ERROR',
  ChangePhoneError = 'CHANGE_PHONE_ERROR',
  OTPError = 'OTP_ERROR',
  MagicLinkError = 'MAGIC_LINK_ERROR',
  MagicLinkInvalid = 'MAGIC_LINK_INVALID',
  TokenError = 'TOKEN_ERROR',
  AppInfoError = 'APP_INFO_ERROR',
  SocialAuthError = 'SOCIAL_AUTH_ERROR',
  StartHostedAuthError = 'START_HOSTED_AUTH_ERROR',
  FinisHostedAuthError = 'FINISH_HOSTED_AUTH_ERROR',
  LogoutHostedAuthError = 'LOGOUT_HOSTED_AUTH_ERROR',
  UpdateMetadataError = 'UPDATE_METADATA_ERROR',
  GetMetadataError = 'GET_METADATA_ERROR',
  DeleteSocialConnectionError = 'DELETE_SOCIAL_CONNECTION_ERROR',
  CreateUserError = 'CREATE_USER_ERROR',
}

export class PassageError extends Error {
  constructor(public code: PassageErrorCode, message?: string) {
    super(message);
    // This line is necessary to preserve the correct instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
  }
}
