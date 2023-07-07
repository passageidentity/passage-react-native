import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'passage-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const PassageReactNative = NativeModules.PassageReactNative
  ? NativeModules.PassageReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export type AuthResult = {
  authToken: string;
  redirectUrl: string;
  refreshToken: string | null;
  refreshTokenExpiration: number | null;
};

export type PassageUser = {
  id: string;
  status: string | null;
  email: string | null;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  userMetadata: any;
  webauthn: boolean;
  webauthnDevices: Array<DevicePasskey>;
  webauthnTypes: Array<string>;
};

export type DevicePasskey = {
  id: string;
  friendlyName: string;
  createdAt: string;
  credId: string;
  lastLoginAt: string;
  updatedAt: string | null;
  userId: string;
  usageCount: number | null;
};

export enum AllowedFallbackAuth {
  LoginCode = 'otp',
  MagicLink = 'magic_link',
  None = 'none',
}

export enum Identifier {
  email = 'email',
  phone = 'phone',
  both = 'both',
}

export enum RequiredIdentifier {
  Phone = 'phone',
  Email = 'email',
  Both = 'both',
  Either = 'either',
}

export type PassageAppInfo = {
  allowedIdentifier: Identifier;
  authFallbackMethod: AllowedFallbackAuth;
  authOrigin: string;
  id: string;
  name: string;
  publicSignup: boolean;
  redirectUrl: string;
  requiredIdentifier: RequiredIdentifier;
  requireIdentifierVerification: boolean;
  sessionTimeoutLength: number;
};

type RegisterWithPasskey = (identifier: string) => Promise<AuthResult>;
type LoginWithPasskey = () => Promise<AuthResult>;
type DeviceSupportsPasskeys = () => Promise<boolean>;
type AuthWithoutPasskey = (identifier: string) => Promise<string>;
type OTPActivate = (otp: string, otpId: string) => Promise<AuthResult>;
type MagicLinkActivate = (magicLink: string) => Promise<AuthResult>;
type GetMagicLinkStatus = (magicLinkId: string) => Promise<AuthResult | null>;
type GetAuthToken = () => Promise<string | null>;
type IsAuthTokenValid = (authToken: string) => Promise<boolean>;
type RefreshAuthToken = () => Promise<string | null>;
type GetAppInfo = () => Promise<PassageAppInfo>;
type AddDevicePasskey = () => Promise<DevicePasskey>;
type DeleteDevicePasskey = (passkeyId: string) => Promise<DevicePasskey>;
type EditDevicePasskey = (
  passkeyId: string,
  newPasskeyName: string
) => Promise<DevicePasskey>;
type VoidMethod = () => Promise<void>;
type ChangeEmail = (newEmail: string) => Promise<string>;
type ChangePhone = (newPhone: string) => Promise<string>;
type GetCurrentUser = () => Promise<PassageUser | null>;

export interface Passage {
  registerWithPasskey: RegisterWithPasskey;
  loginWithPasskey: LoginWithPasskey;
  deviceSupportsPasskeys: DeviceSupportsPasskeys;
  newRegisterOneTimePasscode: AuthWithoutPasskey;
  newLoginOneTimePasscode: AuthWithoutPasskey;
  oneTimePasscodeActivate: OTPActivate;
  newRegisterMagicLink: AuthWithoutPasskey;
  newLoginMagicLink: AuthWithoutPasskey;
  magicLinkActivate: MagicLinkActivate;
  getMagicLinkStatus: GetMagicLinkStatus;
  getAuthToken: GetAuthToken;
  isAuthTokenValid: IsAuthTokenValid;
  refreshAuthToken: RefreshAuthToken;
  getAppInfo: GetAppInfo;
  getCurrentUser: GetCurrentUser;
  signOut: VoidMethod;
  addDevicePasskey: AddDevicePasskey;
  deleteDevicePasskey: DeleteDevicePasskey;
  editDevicePasskeyName: EditDevicePasskey;
  changeEmail: ChangeEmail;
  changePhone: ChangePhone;
}

// PASSKEY METHODS

const registerWithPasskey: RegisterWithPasskey = async (identifier) => {
  const result = await PassageReactNative.registerWithPasskey(identifier);
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const loginWithPasskey: LoginWithPasskey = async () => {
  const result = await PassageReactNative.loginWithPasskey();
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const deviceSupportsPasskeys: DeviceSupportsPasskeys = async () => {
  const result = await PassageReactNative.deviceSupportsPasskeys();
  return result || false;
};

// OTP METHODS

const newRegisterOneTimePasscode: AuthWithoutPasskey = async (identifier) => {
  return await PassageReactNative.newRegisterOneTimePasscode(identifier);
};

const newLoginOneTimePasscode: AuthWithoutPasskey = async (identifier) => {
  return await PassageReactNative.newLoginOneTimePasscode(identifier);
};

const oneTimePasscodeActivate: OTPActivate = async (otp, otpId) => {
  const result = await PassageReactNative.oneTimePasscodeActivate(otp, otpId);
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

// MAGIC LINK METHODS

const newRegisterMagicLink: AuthWithoutPasskey = async (identifier) => {
  return await PassageReactNative.newRegisterMagicLink(identifier);
};

const newLoginMagicLink: AuthWithoutPasskey = async (identifier) => {
  return await PassageReactNative.newLoginMagicLink(identifier);
};

const magicLinkActivate: MagicLinkActivate = async (magicLink) => {
  const result = await PassageReactNative.magicLinkActivate(magicLink);
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const getMagicLinkStatus: GetMagicLinkStatus = async (magicLinkId) => {
  const result = await PassageReactNative.getMagicLinkStatus(magicLinkId);
  if (!result) return null;
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

// TOKEN METHODS

const getAuthToken: GetAuthToken = async () => {
  const authToken = await PassageReactNative.getAuthToken();
  return authToken;
};

const isAuthTokenValid: IsAuthTokenValid = async (token) => {
  const isValid = await PassageReactNative.isAuthTokenValid(token);
  return isValid || false;
};

const refreshAuthToken: RefreshAuthToken = async () => {
  const newAuthToken = await PassageReactNative.refreshAuthToken();
  return newAuthToken;
};

// APP METHODS

const getAppInfo: GetAppInfo = async () => {
  const result = await PassageReactNative.getAppInfo();
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

// USER METHODS

const getCurrentUser: GetCurrentUser = async () => {
  const result = await PassageReactNative.getCurrentUser();
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const signOut: VoidMethod = async () => {
  await PassageReactNative.signOut();
  return;
};

const addDevicePasskey: AddDevicePasskey = async () => {
  const result = await PassageReactNative.addDevicePasskey();
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const deleteDevicePasskey: DeleteDevicePasskey = async (passkeyId) => {
  const result = await PassageReactNative.deleteDevicePasskey(passkeyId);
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const editDevicePasskeyName: EditDevicePasskey = async (
  passkeyId,
  newPasskeyName
) => {
  const result = await PassageReactNative.editDevicePasskeyName(
    passkeyId,
    newPasskeyName
  );
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const changeEmail: ChangeEmail = async (newEmail) => {
  const result = await PassageReactNative.changeEmail(newEmail);
  return result;
};

const changePhone: ChangePhone = async (newPhone) => {
  const result = await PassageReactNative.changePhone(newPhone);
  return result;
};

const PassageMethods: Passage = {
  registerWithPasskey,
  loginWithPasskey,
  deviceSupportsPasskeys,
  newRegisterOneTimePasscode,
  newLoginOneTimePasscode,
  oneTimePasscodeActivate,
  newRegisterMagicLink,
  newLoginMagicLink,
  magicLinkActivate,
  getMagicLinkStatus,
  getAuthToken,
  isAuthTokenValid,
  refreshAuthToken,
  getAppInfo,
  getCurrentUser,
  signOut,
  addDevicePasskey,
  deleteDevicePasskey,
  editDevicePasskeyName,
  changeEmail,
  changePhone,
};

export default PassageMethods;
