import {
  PassageApp,
  PassageCurrentUser,
  PassageHosted,
  PassageMagicLink,
  PassageOneTimePasscode,
  PassagePasskey,
  PassageSocial,
  PassageTokenStore,
} from '.';
import { PassageReactNative } from './shared';

/**
 * The Passage class used to perform register and login operations.
 * The only parameter is the app handle for the application.
 *
 * @example
 * ```
 * import Passage from '@passageidentity/passage-react-native';
 * const passage = new Passage(app_id);
 * ```
 */
export class Passage {
  /**
   * PassageApp class contains functions that operate on the Passage app level.
   */
  public app: PassageApp;
  /**
   * PassagePasskey class contains functions that use passkeys for authentication.
   */
  public passkey: PassagePasskey;
  /**
   * PassageMagicLink class contains functions that use magic links for authentication.
   */
  public magicLink: PassageMagicLink;
  /**
   * PassageOneTimePasscode class contains functions that use one-time passcodes for authentication.
   */
  public oneTimePasscode: PassageOneTimePasscode;
  /**
   * PassageSocial class contains functions that use social providers for authentication.
   */
  public social: PassageSocial;
  /**
   * PassageSocial class contains functions that use social providers for authentication.
   */
  public hosted: PassageHosted;
  /**
   * The PassageSession class used to manage Passage sessions using refresh tokens.
   */
  public tokenStore: PassageTokenStore;

  /**
   * The PassageCurrentUser class contains functions to get information about the currently authenticated user.
   */
  public currentUser: PassageCurrentUser;

  /**
   * Constructor configuring the Passage class' attributes
   * @param {string} appId the App's corresponding AppId
   */
  constructor(private appId: string) {
    PassageReactNative.initWithAppId(appId);
    this.app = new PassageApp();
    this.passkey = new PassagePasskey();
    this.magicLink = new PassageMagicLink();
    this.oneTimePasscode = new PassageOneTimePasscode();
    this.social = new PassageSocial();
    this.hosted = new PassageHosted();
    this.tokenStore = new PassageTokenStore();
    this.currentUser = new PassageCurrentUser();
  }
}
