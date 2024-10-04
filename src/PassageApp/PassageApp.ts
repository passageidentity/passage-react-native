import { PassageError, PassageReactNative } from '../../src/shared';
import type { Metadata, PassageAppInfo, PublicUserInfo } from '../';

/**
 * PassageApp class contains functions that operate on the Passage app level.
 */
export class PassageApp {
  /**
   * Get information about an app.
   *
   * @return {Promise<PassageAppInfo>} a data object containing app information and the authentication policy
   */
  public async info(): Promise<PassageAppInfo> {
    try {
      const result = await PassageReactNative.appInfo();
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Look-up a user and return the user properties if the user exists
   * @param {string} identifier email address / phone for user
   * @return {Promise<PublicUserInfo | null>}
   */
  public async userExists(identifier: string): Promise<PublicUserInfo | null> {
    try {
      const result = await PassageReactNative.appUserExists(identifier);
      if (result) {
        const parsedResult = JSON.parse(result);
        return parsedResult;
      } else {
        return null;
      }
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * createUser creates a user in a 'pending' state.
   * @param {string} identifier the email or phone number of the user
   * @param {Metadata} userMetadata optional metadata to associate with the user
   * @return {Promise<PublicUserInfo>}
   */
  public async createUser(
    identifier: string,
    userMetadata?: Metadata
  ): Promise<PublicUserInfo> {
    try {
      const result = await PassageReactNative.appCreateUser(
        identifier,
        userMetadata || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }
}
