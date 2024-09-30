import { Platform } from 'react-native';
import {
  AuthResult,
  PassageError,
  PassageReactNative,
  waitForDeepLinkQueryValues,
} from '../shared';
import { SocialConnection } from '.';

/**
 * PassageSocial class contains functions that use social providers for authentication.
 */
export class PassageSocial {
  /**
   * Initiates authorization via a supported third-party social provider.
   * @param {SocialConnection} connection The social connection to use for login.
   */
  async authorize(connection: SocialConnection): Promise<AuthResult> {
    return new Promise(async (resolve, reject) => {
      try {
        let authResultJson: string;
        if (Platform.OS === 'ios') {
          // The iOS native "authorize" method returns an AuthResult directly.
          authResultJson = await PassageReactNative.socialAuthorize(connection);
        } else {
          // The Android native "authorize" method opens a Chrome Tab and returns void.
          await PassageReactNative.socialAuthorize(connection);
          // Wait for a redirect back into the app with the auth code.
          const authCodeObj = await waitForDeepLinkQueryValues(['code']);
          const authCode = authCodeObj.code;
          authResultJson = await PassageReactNative.socialAuthorizeFinish(
            authCode
          );
        }
        const authResult = JSON.parse(authResultJson);
        resolve(authResult);
      } catch (error: any) {
        reject(new PassageError(error.code, error.message));
      }
    });
  }
}
