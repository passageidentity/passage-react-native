export enum WebAuthnType {
  Passkey = 'passkey',
  SecurityKey = 'security_key',
  Platform = 'platform',
}

export type WebAuthnIcons = {
  light: string | null;
  dark: string | null;
};

export type Passkey = {
  /**
   * The first time this webAuthn device was used to authenticate the user
   */
  createdAt: string;
  /**
   * The CredID for this webAuthn device (encoded to match what is stored in psg_cred_obj)
   */
  credId: string;
  /**
   * The friendly name for the webAuthn device used to authenticate
   */
  friendlyName: string;
  /**
   * The ID of the webAuthn device used for authentication
   */
  id: string;
  /**
   * The last time this webAuthn device was used to authenticate the user
   */
  lastLoginAt: string;
  /**
   * WebAuthnType
   */
  type: WebAuthnType;
  /**
   * The last time this webAuthn device was updated
   */
  updatedAt: string;
  /**
   * How many times this webAuthn device has been used to authenticate the user
   */
  usageCount: number;
  /**
   * The UserID for this webAuthn device
   */
  userId: string;
  /**
   * WebAuthn icons
   */
  icons: WebAuthnIcons;
};
