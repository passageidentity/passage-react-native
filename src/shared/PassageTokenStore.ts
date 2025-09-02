import { PassageError, PassageReactNative } from './';
import type { AuthResult } from './';

export class PassageTokenStore {
  /**
   * Returns the auth token for the currently authenticated user.
   * If the stored auth token is invalid, this method will use the refresh token to get and save a new auth token.
   *
   * @return {Promise<string | null>} the valid auth token or null
   */
  async getValidAuthToken(): Promise<string | null> {
    try {
      return await PassageReactNative.tokenStoreGetValidAuthToken();
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Checks validity of stored auth token.
   *
   * @return {Promise<boolean>} true if auth token is valid
   */
  async isAuthTokenValid(): Promise<boolean> {
    try {
      const result = await PassageReactNative.tokenStoreIsAuthTokenValid();
      return result || false;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Refreshes stored auth token. Returns updated AuthResult if successful.
   *
   * @return {Promise<AuthResult>} The authentication token, redirect URL, and refresh token, if configured for the application.
   */
  async refreshAuthToken(): Promise<AuthResult> {
    try {
      const result = await PassageReactNative.tokenStoreRefreshAuthToken();
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }

  /**
   * Revokes the current refresh token, removing it from the server.
   */
  async revokeRefreshToken(): Promise<void> {
    try {
      await PassageReactNative.tokenStoreRevokeRefreshToken();
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }
}
