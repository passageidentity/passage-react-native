// Passage app info
export const PASSAGE_TEST_APP_ID = 'bBqc7EnMTQgmJpplYHkDz65C';
export const EXISTING_USER_EMAIL = 'authentigator+1733425047718@ncor7c1m.mailosaur.net';
export const MAGIC_LINK_TEST_APP_ID = 'BIabIdNpWnlik2B7mSxUyViL';
export const MAGIC_LINK_USER_EMAIL = 'authentigator+1733510352448@ncor7c1m.mailosaur.net';

// Alert strings
export const CLOSE = 'close';
export const ERROR = 'error';
export const FAILURE = 'failure';
export const SUCCESS = 'success';
export const TEST_RESULT = 'test_result';

// App test strings
export enum AppTest {
  GetAppInfo = 'GetAppInfo',
  UserExists = 'UserExists',
  UserDoesNotExist = 'UserDoesNotExist',
  CreateUser = 'CreateUser',
  CreateUserExists = 'CreateUserExists',
}

// OTP test strings
export enum OTPTest {
  RegisterAndActivate = 'OTPRegisterAndActivate',
  LoginAndActivate = 'OTPLoginAndActivate',
}

// Magic Link test strings
export enum MagicLinkTest {
  RegisterAndActivate = 'MLRegisterAndActivate',
  LoginAndActivate = 'MLLoginAndActivate',
}

