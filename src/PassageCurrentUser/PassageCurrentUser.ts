import { MagicLink } from '../PassageMagicLink';
import { PasskeyCreationOptions } from '../PassagePasskey';
import { PassageError, PassageReactNative } from '../shared';
import {
  CurrentUser,
  Metadata,
  Passkey,
  SocialConnectionType,
  UserSocialConnections,
} from './';

/**
 * The PassageCurrentUser class contains functions to get information about the currently authenticated user.
 */
export class PassageCurrentUser {
  /**
   * userInfo returns the user information for the currently authenticated user. If the user is not authenticated, an error is thrown.
   * @return {CurrentUser} the current Passage user's info
   */
  async userInfo(): Promise<CurrentUser> {
    try {
      const result = await PassageReactNative.currentUserUserInfo();
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * changeEmail initiates an email change for the authenticated user. An email change requires verification, so an email will be sent to the user which they must verify before the email change takes effect.
   * @param {string} newEmail
   * @param {string?} language the language string for localizing emails, if no lanuage or an invalid language is provided the application default lanuage will be used
   * @return {MagicLink} the magicLink response on success.
   */
  async changeEmail(newEmail: string, language?: string): Promise<MagicLink> {
    try {
      const result = await PassageReactNative.currentUserChangeEmail(
        newEmail,
        language
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * changePhone initiates a phone number change for the authenticated user. An phone number change requires verification, so an SMS with a link will be sent to the user which they must verify before the phone number change takes effect.
   * @param {string} newPhone
   * @param {string?} language the language string for localizing emails, if no lanuage or an invalid language is provided the application default lanuage will be used
   * @return {MagicLink} the magicLink response on success.
   */
  async changePhone(newPhone: string, language?: string): Promise<MagicLink> {
    try {
      const result = await PassageReactNative.currentUserChangePhone(
        newPhone,
        language
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Get the list of the current users's passkeys.
   * @return {Passkey[]} the array of passkeys.
   */
  async passkeys(): Promise<Passkey[]> {
    try {
      const result = await PassageReactNative.currentUserPasskeys();
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * editPasskey allows the passkey's friendly name to be changed.
   * @param {string} passkeyId
   * @param {string} friendlyName
   * @return {Passkey} the edited device after applying the requested device attribute changes.
   */
  async editPasskey(passkeyId: string, friendlyName: string): Promise<Passkey> {
    try {
      const result = await PassageReactNative.currentUserEditPasskey(
        passkeyId,
        friendlyName
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * addPasskey register a new passkey for the current user.
   * @param {PasskeyCreationOptions} options Optional configuration for passkey creation
   * @return {Passkey} the new passkey regsitered for the current user.
   */
  async addPasskey(options?: PasskeyCreationOptions): Promise<Passkey> {
    try {
      const result = await PassageReactNative.currentUserAddPasskey(
        options || null
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * deletePasskey deletes an existing passkey for the current user.
   * @param {Passkey} passkey the passkey to be deleted
   * @return {boolean} true if the device has been deleted successfully.
   */
  async deletePasskey(passkeyId: string): Promise<boolean> {
    try {
      const result = await PassageReactNative.currentUserDeletePasskey(
        passkeyId
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * listSocialConnections is used to list the current user's social connections.
   * @return {Promise<UserSocialConnection> } the current social connections and their properties.
   */
  async listSocialConnections(): Promise<UserSocialConnections> {
    try {
      const result =
        await PassageReactNative.currentUserListSocialConnections();
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * deleteSocialConnection deletes an existing social connection for the current user.
   * @param {SocialConnectionType} socialConnectionType the social connection to be deleted
   * @return {boolean} true if the social connection has been deleted successfully.
   */
  async deleteSocialConnection(
    socialConnectionType: SocialConnectionType
  ): Promise<boolean> {
    try {
      await PassageReactNative.currentUserDeleteSocialConnection(
        socialConnectionType
      );
      return true;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * getMetadata returns the metadata for the currently authenticated user.
   * @return {Metadata} the current Passage user's info, or undefined if the
   * current Passage user's authentication token could not be validated.
   */
  async metadata(): Promise<Metadata> {
    try {
      const result = await PassageReactNative.currentUserMetadata();
      const parsedResult = JSON.parse(result);
      return parsedResult as Metadata;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * updateMetadata updates the metadata for the currentuser. Note that only metadata fields set for the app can be updated.
   * @param {Metadata} metadata
   * @return {CurrentUser} the current user with their newly updated metadata field.
   */
  async updateMetadata(metadata: Metadata): Promise<CurrentUser> {
    try {
      const result = await PassageReactNative.currentUserUpdateMetadata(
        metadata
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }
}
