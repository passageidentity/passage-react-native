import type {
  Passkey,
  UserSocialConnections,
  UserStatus,
  WebAuthnType,
} from '../';

export type CurrentUser = {
  /**
   * When this user was created
   */
  createdAt: string;
  /**
   * The user's email
   */
  email: string;
  /**
   * Whether or not the user's email has been verified
   */
  emailVerified: boolean;
  /**
   * The user ID
   */
  id: string;
  /**
   * The last time this user logged in
   */
  lastLoginAt: string;
  /**
   * How many times the user has successfully logged in
   */
  loginCount: number;
  /**
   * The user's phone
   */
  phone: string;
  /**
   * Whether or not the user's phone has been verified
   */
  phoneVerified: boolean;
  /**
   * User's social connections
   */
  socialConnections: UserSocialConnections;
  /**
   * User's status
   */
  status: UserStatus;
  /**
   * When this user was last updated
   */
  updatedAt: string;
  /**
   * User metadata
   */
  userMetadata: object | null;
  /**
   * Whether or not the user has authenticated via webAuthn before (if len(WebAuthnDevices) > 0)
   */
  webauthn: boolean;
  /**
   * The list of devices this user has authenticated with via webAuthn
   */
  webauthnDevices: Array<Passkey>;
  /**
   * List of credential types that user has created
   */
  webauthnTypes: Array<WebAuthnType>;
};
