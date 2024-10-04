import { Platform } from 'react-native';
import {
  AuthResult,
  PassageError,
  PassageReactNative,
  waitForDeepLinkQueryValues,
} from '../shared';

/**
 * PassageHosted class contains functions that use Hosted Login for authentication.
 */
export class PassageHosted {
  /**
   * Authentication method for Passage Hosted apps
   * If your Passage app is Hosted, use this method to register and log in your user.
   * This method will open up a Passage login experience in a secure web view.
   */
  async authorize(): Promise<AuthResult> {
    try {
      if (Platform.OS === 'ios') {
        // The iOS native "hostedAuthStart" method returns an AuthResult directly.
        const result = await PassageReactNative.hostedAuthorize();
        return JSON.parse(result);
      } else {
        // The Android native "hostedAuthStart" method opens a Chrome Tab and returns void.
        await PassageReactNative.hostedAuthorize();
        // Wait for a redirect back into the app with the auth code.
        const { code: authCode, state } = await waitForDeepLinkQueryValues([
          'code',
          'state',
        ]);
        let result = await PassageReactNative.hostedFinish(authCode, state);
        return JSON.parse(result);
      }
    } catch (error: any) {
      throw new PassageError(error.code, error.message);
    }
  }
}
