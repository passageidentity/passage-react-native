import { Platform } from 'react-native';
import { AuthResult, PassageError, PassageReactNative } from '../shared';
import { PasskeyCreationOptions } from './PasskeyCreationOptions';

/**
 * PassagePasskey class contains functions that use passkeys for authentication.
 */
export class PassagePasskey {
  /**
   * Registers a new user with a passkey. Will throw an error if the user has already logged into their account at lesst once.
   * @param {string} identifier
   * @param {PasskeyCreationOptions | undefined} options
   * @returns {AuthResult} The authentication token, redirect URL, and refresh token, if configured for the application.
   */
  async register(
    identifier: string,
    options?: PasskeyCreationOptions
  ): Promise<AuthResult> {
    try {
      const result = await PassageReactNative.passkeyRegister(
        identifier,
        options || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Logs in an existing user with a passkey. Will throw an error if the user does not exist, has no passkeys, or if the operation is cancelled with an abort signal.
   * If no identifier is provided, the user will be prompted to select an identifier, formally known as WebAuthn discoverable credentials.
   * @param {string} identifier
   * @returns {AuthResult} The authentication token, redirect URL, and refresh token, if configured for the application.
   */
  async login(identifier?: string): Promise<AuthResult> {
    try {
      const result = await PassageReactNative.passkeyLogin(identifier || null);
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Checks if the user's device supports passkeys.
   */
  isSupported(): boolean {
    if (Platform.OS === 'ios') {
      const iosVersion = parseFloat(Platform.Version as string);
      return iosVersion >= 16;
    } else if (Platform.OS === 'android') {
      const androidVersion = Platform.Version as number;
      return androidVersion >= 28;
    } else {
      return false; // Unsupported platform
    }
  }
}
