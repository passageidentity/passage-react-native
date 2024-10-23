import { PassageError, type AuthResult, PassageReactNative } from '../shared';
import type { OneTimePasscode } from '../';

/**
 * PassageOneTimePasscode class contains functions that use one-time passcodes for authentication.
 */
export class PassageOneTimePasscode {
  /**
   * Create a new one-time passcode for registration. Will throw an error if the user has already logged into their account at least once.
   * @param {string} identifier The Passage User's identifier
   * @param {string} language the language string for localizing emails, if no lanuage or an invalid language is provided the application default lanuage will be used
   * @return {Promise<OneTimePasscode>} One-time passcode object
   */
  async register(
    identifier: string,
    language?: string
  ): Promise<OneTimePasscode> {
    try {
      const result = await PassageReactNative.oneTimePasscodeRegister(
        identifier,
        language || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Create a new one-time passcode for login. Will throw an error if the user does not exist.
   * @param {string} identifier The Passage User's identifier
   * @param {string} language the language string for localizing emails, if no lanuage or an invalid language is provided the application default lanuage will be used
   * @return {Promise<OneTimePasscode>} One-time passcode object
   */
  async login(identifier: string, language?: string): Promise<OneTimePasscode> {
    try {
      const result = await PassageReactNative.oneTimePasscodeLogin(
        identifier,
        language || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Activates a one-time passcode. Handles login and registration one-time passcodes.
   * Will throw an error if the one-time passcode is invalid, expired, or has already been activated.
   * @param {string} oneTimePasscode The one-time passcode provided by the user from their email or text message.
   * @param {string} id The id associated with the one-time passcode.
   * @returns
   */
  async activate(oneTimePasscode: string, id: string): Promise<AuthResult> {
    try {
      const result = await PassageReactNative.oneTimePasscodeActivate(
        oneTimePasscode,
        id
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }
}
