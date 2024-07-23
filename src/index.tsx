import { NativeModules, Platform } from 'react-native';
import { waitForDeepLinkQueryValues } from './utils/waitForDeepLinkQueryValues';

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
}

export class PassageError extends Error {
  constructor(public code: PassageErrorCode, message?: string) {
    super(message);
    // This line is necessary to preserve the correct instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
  }
}

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
  webauthnDevices: Array<Passkey>;
  webauthnTypes: Array<string>;
};

export type Passkey = {
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
  /**
   * @deprecated Check the authMethods property for the full list of supported authentication methods and their configurations.
   */
  authFallbackMethod: AllowedFallbackAuth;
  authOrigin: string;
  id: string;
  name: string;
  publicSignup: boolean;
  redirectUrl: string;
  requiredIdentifier: RequiredIdentifier;
  requireIdentifierVerification: boolean;
  sessionTimeoutLength: number;
  userMetadataSchema: Array<PassageAppUserMetadataSchema> | null;
  authMethods: {
    passkeys?: Record<string, never>;
    otp?: EmailAndSMSAuthMethod;
    magicLink?: EmailAndSMSAuthMethod;
  };
};

export type PassageAppUserMetadataSchema = {
  fieldName: string;
  friendlyName: string;
  id: string;
  profile: boolean;
  registration: boolean;
  type: string;
};

export type EmailAndSMSAuthMethod = {
  ttl: number;
  ttl_display_unit: DisplayUnit;
};

export enum AuthenticatorAttachment {
  Platform = 'platform',
  CrossPlatform = 'cross-platform',
  Any = 'any',
}

export interface PasskeyCreationOptions {
  authenticatorAttachment?: AuthenticatorAttachment;
}

export enum DisplayUnit {
  Seconds = 's',
  Minutes = 'm',
  Hours = 'h',
  Days = 'd',
}

export enum SocialConnection {
  Apple = 'apple',
  Github = 'github',
  Google = 'google',
}

type RegisterWithPasskey = (
  identifier: string,
  options?: PasskeyCreationOptions
) => Promise<AuthResult>;
type LoginWithPasskey = (identifier?: string | null) => Promise<AuthResult>;
type DeviceSupportsPasskeys = () => Promise<boolean>;
type AuthWithoutPasskey = (identifier: string) => Promise<string>;
type OTPActivate = (otp: string, otpId: string) => Promise<AuthResult>;
type MagicLinkActivate = (magicLink: string) => Promise<AuthResult>;
type GetMagicLinkStatus = (magicLinkId: string) => Promise<AuthResult | null>;
type AuthorizeWith = (connection: SocialConnection) => Promise<AuthResult>;
type GetAuthToken = () => Promise<string | null>;
type IsAuthTokenValid = (authToken: string) => Promise<boolean>;
type RefreshAuthToken = () => Promise<string | null>;
type GetAppInfo = () => Promise<PassageAppInfo>;
type IdentifierExists = (identifier: string) => Promise<PassageUser | null>;
type AddPasskey = () => Promise<Passkey>;
type DeletePasskey = (passkeyId: string) => Promise<void>;
type EditPasskeyName = (
  passkeyId: string,
  newPasskeyName: string
) => Promise<Passkey>;
type VoidMethod = () => Promise<void>;
type ChangeEmail = (newEmail: string) => Promise<string>;
type ChangePhone = (newPhone: string) => Promise<string>;
type GetCurrentUser = () => Promise<PassageUser | null>;
type AuthorizeWithHostedLogin = () => Promise<AuthResult>;
type HostedLogout = () => Promise<void>;

/**
 * The Passage class is used to perform authentication and user operations.
 *
 * @example
 * ```
 * import Passage from '@passageidentity/passage-react-native';
 *
 * const passage = new Passage('MY_APP_ID');
 * ```
 */
class Passage {
  constructor(appId: String | null = null) {
    if (!appId) return;
    PassageReactNative.initWithAppId(appId);
  }

  // PASSKEY METHODS

  /**
   * Passage will attempt create and register a new user with a passkey.
   *
   * @param {string} identifier email address / phone for user
   * @return {Promise<AuthResult>} a data object that includes a redirect URL and saves the authorization token and (optional) refresh token securely to device.
   * @throws {PassageError} When user cancels operation, user already exists, app configuration was not done properly, etc.
   */
  registerWithPasskey: RegisterWithPasskey = async (
    identifier: string,
    options?: PasskeyCreationOptions
  ): Promise<AuthResult> => {
    try {
      const result = await PassageReactNative.registerWithPasskey(
        identifier,
        options || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Passage will attempt login user with a passkey.
   *
   * NOTE: Both Android and iOS do NOT take a user identifier paramter when logging in with a passkey.
   * The operating systems both show all of the passkeys available for the user and your application.
   *
   * @param {string | null} identifier email address / phone for user (optional)
   * @return {Promise<AuthResult>} a data object that includes a redirect URL and saves the authorization token and (optional) refresh token securely to device.
   * @throws {PassageError} When user cancels operation, user does not exist, app configuration was not done properly, etc.
   */
  loginWithPasskey: LoginWithPasskey = async (
    identifier?: string | null
  ): Promise<AuthResult> => {
    try {
      const result = await PassageReactNative.loginWithPasskey(
        identifier || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Uses information about the user's OS version to determine if passkey authentication is available.
   *
   * @return {Promise<boolean>} returns true if the device supports passkeys, false if not.
   */
  deviceSupportsPasskeys: DeviceSupportsPasskeys =
    async (): Promise<boolean> => {
      const result = await PassageReactNative.deviceSupportsPasskeys();
      return result || false;
    };

  // OTP METHODS

  /**
   * Create and send a new one time passcode for registration
   *
   * @param {string} identifier The Passage User's identifier
   * @return {Promise<string>} Returns a one time passcode id used to activate the passcode in `oneTimePasscodeActivate`.
   * @throws {PassageError}
   */
  newRegisterOneTimePasscode: AuthWithoutPasskey = async (
    identifier: string
  ): Promise<string> => {
    try {
      return await PassageReactNative.newRegisterOneTimePasscode(identifier);
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Create and send a new one time passcode for logging in
   *
   * @param {string} identifier The Passage User's identifier
   * @return {Promise<string>} Returns a one time passcode id used to activate the passcode in `oneTimePasscodeActivate`.
   * @throws {PassageError}
   */
  newLoginOneTimePasscode: AuthWithoutPasskey = async (
    identifier: string
  ): Promise<string> => {
    try {
      return await PassageReactNative.newLoginOneTimePasscode(identifier);
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Activates a one time passcode when a user fills out the one time passcode input. This function handles login and registration one time passcodes.
   *
   * @param {string} otp The one time passcode.
   * @param {string} otpId The one time passcode id.
   * @return {Promise<AuthResult>} a data object that includes a redirect URL and saves the authorization token and (optional) refresh token securely to device.
   * @throws {PassageError}
   */
  oneTimePasscodeActivate: OTPActivate = async (
    otp: string,
    otpId: string
  ): Promise<AuthResult> => {
    try {
      const result = await PassageReactNative.oneTimePasscodeActivate(
        otp,
        otpId
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  // MAGIC LINK METHODS

  /**
   * Create and send a new magic link for registration
   *
   * @param {string} identifier The Passage User's identifier
   * @return {Promise<string>} Returns a magic link id used to check the status of the magic link with `getMagicLinkStatus`.
   * @throws {PassageError}
   */
  newRegisterMagicLink: AuthWithoutPasskey = async (
    identifier: string
  ): Promise<string> => {
    try {
      return await PassageReactNative.newRegisterMagicLink(identifier);
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Create and send a new magic link for logging in
   *
   * @param {string} identifier The Passage User's identifier
   * @return {Promise<string>} Returns a magic link id used to check the status of the magic link with `getMagicLinkStatus`.
   * @throws {PassageError}
   */
  newLoginMagicLink: AuthWithoutPasskey = async (
    identifier: string
  ): Promise<string> => {
    try {
      return await PassageReactNative.newLoginMagicLink(identifier);
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Activates a magic link. This function handles login and registration magic links.
   *
   * @param {string} magicLink The magic link from the url sent to the user.
   * @return {Promise<AuthResult>} A data object that includes a redirect URL and saves the authorization token and (optional) refresh token securely to device.
   * @throws {PassageError}
   */
  magicLinkActivate: MagicLinkActivate = async (
    magicLink: string
  ): Promise<AuthResult> => {
    try {
      const result = await PassageReactNative.magicLinkActivate(magicLink);
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Look up a magic link by ID and check if it has been verified. This function is mostly commonly used to
   * iteratively check if a user has clicked a magic link to login. Once the link has been verified,
   * Passage will return authentication information via this function. This enables cross-device login.
   *
   * @param {string} magicLinkId The magic link id.
   * @return {Promise<AuthResult | null>} A data object that includes a redirect URL and saves the authorization token and (optional) refresh token securely to device.
   * @throws {PassageError}
   */
  getMagicLinkStatus: GetMagicLinkStatus = async (
    magicLinkId: string
  ): Promise<AuthResult | null> => {
    try {
      const result = await PassageReactNative.getMagicLinkStatus(magicLinkId);
      if (!result) return null;
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Authorizes user via a supported third-party social provider.
   *
   * @param {SocialConnection} connection The Social connection to use for authorization
   * @returns {Promise<AuthResult>} A data object that includes a redirect URL and saves the authorization token and (optional) refresh token securely to device.
   * @throws {PassageError}
   */
  authorizeWith: AuthorizeWith = async (
    connection: SocialConnection
  ): Promise<AuthResult> => {
    return new Promise(async (resolve, reject) => {
      try {
        let authResultJson: string;
        if (Platform.OS === 'ios') {
          // The iOS native "authorizeWith" method returns an AuthResult directly.
          authResultJson = await PassageReactNative.authorizeWith(connection);
        } else {
          // The Android native "authorizeWith" method opens a Chrome Tab and returns void.
          await PassageReactNative.authorizeWith(connection);
          // Wait for a redirect back into the app with the auth code.
          const authCodeObj = await waitForDeepLinkQueryValues(['code']);
          const authCode = authCodeObj.code;
          authResultJson = await PassageReactNative.finishSocialAuthentication(
            authCode
          );
        }
        const authResult = JSON.parse(authResultJson);
        resolve(authResult);
      } catch (error: any) {
        reject(new PassageError(error.code, error.message));
      }
    });
  };

  // TOKEN METHODS

  /**
   * Returns the auth token for the currently authenticated user.
   *
   * @return {Promise<string | null>} The current Passage user's auth token, or null if no token has been stored.
   */
  getAuthToken: GetAuthToken = async (): Promise<string | null> => {
    const authToken = await PassageReactNative.getAuthToken();
    return authToken;
  };

  /**
   * Checks if the auth token for the currently authenticated user is valid.
   *
   * @return {Promise<boolean>} Returns true if the user has a valid auth token, false if not.
   */
  isAuthTokenValid: IsAuthTokenValid = async (token): Promise<boolean> => {
    const isValid = await PassageReactNative.isAuthTokenValid(token);
    return isValid || false;
  };

  /**
   * Refreshes, gets, and saves a new authToken for the currently authenticated user using their refresh token
   *
   * @return {Promise<string>} Returns the new auth token.
   * @throws {PassageError}
   */
  refreshAuthToken: RefreshAuthToken = async (): Promise<string> => {
    try {
      const newAuthToken = await PassageReactNative.refreshAuthToken();
      return newAuthToken;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  // APP METHODS

  /**
   * Get information about an app.
   *
   * @return {Promise<PassageAppInfo>} A data object containing app information, authentication policy, etc.
   * @throws {PassageError}
   */
  getAppInfo: GetAppInfo = async (): Promise<PassageAppInfo> => {
    try {
      const result = await PassageReactNative.getAppInfo();
      const parsedResult = JSON.parse(result);
      if (
        parsedResult.authFallbackMethod &&
        parsedResult.authFallbackMethod === 'magicLink'
      ) {
        parsedResult.authFallbackMethod = 'magic_link';
      }
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Check if a user with a given identifier exists. If so, this method will return user info.
   *
   * @return {Promise<PassageUser | null>} A data object containing user information.
   * @throws {PassageError}
   */
  identifierExists: IdentifierExists = async (
    identifier: string
  ): Promise<PassageUser | null> => {
    try {
      const result = await PassageReactNative.identifierExists(identifier);
      if (!result) return null;
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  // USER METHODS

  /**
   * Returns the user information for the currently authenticated user.
   *
   * @return {Promise<PassageUser | null>} The current Passage user's info, or null if the current Passage user's authentication token could not be validated.
   */
  getCurrentUser: GetCurrentUser = async (): Promise<PassageUser | null> => {
    const result = await PassageReactNative.getCurrentUser();
    if (!result) return null;
    const parsedResult = JSON.parse(result);
    return parsedResult;
  };

  /**
   * Sign out a user by deleting their auth token and refresh token from device, and revoking their refresh token.
   */
  signOut: VoidMethod = async () => {
    return await PassageReactNative.signOut();
  };

  /**
   * Passage will attempt to create and register a new passkey for the authenticated user.
   *
   * @return {Promise<DevicePasskey>} an object containing all of the data about the new passkey.
   * @throws {PassageError} When user cancels operation, app configuration was not done properly, etc.
   */
  addPasskey: AddPasskey = async (): Promise<Passkey> => {
    try {
      const result = await PassageReactNative.addDevicePasskey();
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Remove a passkey from a user's account.
   * NOTE: This does NOT remove the passkey from the user's device, but revokes that passkey so its no longer usable.
   *
   * @param {string} passkeyId The id of the passkey to delete.
   * @throws {PassageError}
   */
  deletePasskey: DeletePasskey = async (passkeyId: string) => {
    try {
      return await PassageReactNative.deleteDevicePasskey(passkeyId);
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Edit the `friendlyName` of the authenticated user's device passkey.
   *
   * @param {string} passkeyId The id of the passkey to edit.
   * @param {string} newPasskeyName The passkey's new name.
   * @return {Promise<DevicePasskey>} an object containing all of the data about the new passkey.
   * @throws {PassageError}
   */
  editPasskeyName: EditPasskeyName = async (
    passkeyId: string,
    newPasskeyName: string
  ): Promise<Passkey> => {
    try {
      const result = await PassageReactNative.editDevicePasskeyName(
        passkeyId,
        newPasskeyName
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Initiate an email change for the authenticated user. An email change requires verification, so an email will be sent to the user which they must verify before the email change takes effect.
   * @param {string} newEmail The user's new email.
   * @return {Promise<string>} The magic link id.
   * @throws {PassageError}
   */
  changeEmail: ChangeEmail = async (newEmail: string): Promise<string> => {
    try {
      const result = await PassageReactNative.changeEmail(newEmail);
      return result;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Initiate a phone number change for the authenticated user. An phone change requires verification, so an email will be sent to the user which they must verify before the phone change takes effect.
   * @param {string} newPhone The user's new phone number.
   * @return {Promise<string>} The magic link id.
   * @throws {PassageError}
   */
  changePhone: ChangePhone = async (newPhone: string): Promise<string> => {
    try {
      const result = await PassageReactNative.changePhone(newPhone);
      return result;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };

  /**
   * Authentication Method for Hosted Apps
   * If your Passage app is Hosted, use this method to register and log in your user.
   * This method will open up a Passage login experience
   * @param {string} clientSecret You hosted app's client secret, found in Passage Console's OIDC Settings.n
   * @returns {Promise<AuthResultWithIdToken>} A data object that includes AuthResult and idToken
   * @throws {PassageError}
   */
  authorizeWithHostedLogin: AuthorizeWithHostedLogin =
    async (): Promise<AuthResult> => {
      try {
        if (Platform.OS === 'ios') {
          // The iOS native "hostedAuthStart" method returns an AuthResult directly.
          const result = await PassageReactNative.hostedAuth();
          return JSON.parse(result);
        } else {
          // The Android native "hostedAuthStart" method opens a Chrome Tab and returns void.
          await PassageReactNative.hostedAuthStart();
          // Wait for a redirect back into the app with the auth code.
          const { code: authCode, state } = await waitForDeepLinkQueryValues([
            'code',
            'state',
          ]);
          let result = await PassageReactNative.hostedAuthFinish(
            authCode,
            state
          );
          return JSON.parse(result);
        }
      } catch (error: any) {
        throw new PassageError(error.code, error.message);
      }
    };

  /**
   * Logout Method for Hosted Apps
   *
   * If your Passage app is Hosted, use this method to log out your user. This method will briefly open up a web view where it will log out the
   */

  hostedLogout: HostedLogout = async (): Promise<void> => {
    try {
      await PassageReactNative.hostedLogout();
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  };
}

export default Passage;
