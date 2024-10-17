export enum AuthenticatorAttachment {
  Platform = 'platform',
  CrossPlatform = 'cross-platform',
  Any = 'any',
}

export interface PasskeyCreationOptions {
  authenticatorAttachment?: AuthenticatorAttachment;
}
