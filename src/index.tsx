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

export type PasskeyCredential = {
  id: string | null;
  friendlyName: string | null;
};

type RegisterWithPasskey = (identifier: string) => Promise<AuthResult>;
type LoginWithPasskey = () => Promise<AuthResult>;
type AuthWithoutPasskey = (identifier: string) => Promise<string>;
type OTPActivate = (otp: string, otpId: string) => Promise<AuthResult>;
type MagicLinkActivate = (magicLink: string) => Promise<AuthResult>;
// type AddDevicePasskey = () => Promise<PasskeyCredential>; // TODO: iOS SDK does not return anything, need to fix later.
type AddDevicePasskey = () => Promise<void>;

interface Passage {
  registerWithPasskey: RegisterWithPasskey;
  loginWithPasskey: LoginWithPasskey;
  newRegisterOneTimePasscode: AuthWithoutPasskey;
  newLoginOneTimePasscode: AuthWithoutPasskey;
  oneTimePasscodeActivate: OTPActivate;
  newRegisterMagicLink: AuthWithoutPasskey;
  newLoginMagicLink: AuthWithoutPasskey;
  magicLinkActivate: MagicLinkActivate;
  addDevicePasskey: AddDevicePasskey;
}

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

const addDevicePasskey: AddDevicePasskey = async () => {
  const result = await PassageReactNative.addDevicePasskey();
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

const PassageMethods: Passage = {
  registerWithPasskey,
  loginWithPasskey,
  newRegisterOneTimePasscode,
  newLoginOneTimePasscode,
  oneTimePasscodeActivate,
  newRegisterMagicLink,
  newLoginMagicLink,
  magicLinkActivate,
  addDevicePasskey,
};

export default PassageMethods;
