import { PassageError, PassageReactNative } from '../shared';
import type { AuthResult, MagicLink } from '../';

/**
 * PassageMagicLink class contains functions that use magic links for authentication, identitfy verification, and handling identifier changes.
 */
export class PassageMagicLink {
  /**
   * Create a new magic link for registration. Will throw an error if the user has already logged into their account at least once.
   * @param {string} identifier The Passage User's identifier
   * @param {string} language the language string for localizing emails, if no lanuage or an invalid language is provided the application default lanuage will be used
   * @return {Promise<MagicLink>} MagicLink JSON payload
   */
  async register(identifier: string, language?: string): Promise<MagicLink> {
    try {
      const result = await PassageReactNative.magicLinkRegister(
        identifier,
        language
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Creates a new magic link for login. Will throw an error if the user does not exist.
   * @param {string} identifier The Passage User's identifier
   * @param {string} language the language string for localizing emails, if no lanuage or an invalid language is provided the application default lanuage will be used
   * @return {Promise<MagicLink>} MagicLink JSON payload
   */
  async login(identifier: string, language?: string): Promise<MagicLink> {
    try {
      const result = await PassageReactNative.magicLinkLogin(
        identifier,
        language
      );
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Activates a magic link. Handles login, registration, identifier verification, and identifier change magic links.
   * Will throw an error if the magic link is invalid, expired, or has already been activated.
   *
   * @param {string} magicLink The magic link to activate
   * @return {Promise<AuthResult>}
   */
  async activate(magicLink: string): Promise<AuthResult> {
    try {
      const result = await PassageReactNative.magicLinkActivate(magicLink);
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Look up a magic link by ID and check if it has been verified. This function is most commonly used to
   * iteratively check if a user has clicked a magic link to login. Once the link has been verified,
   * Passage will return authentication information via this endpoint. This enables cross-device login.
   * This will throw an error if the magic link is not activated.
   *
   * @param {string} id unique ID for an magic link which is returned by functions that create a magic link
   * @return {Promise<AuthResult>}
   */
  async status(id: string): Promise<AuthResult> {
    try {
      const result = await PassageReactNative.magicLinkStatus(id);
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }
}
