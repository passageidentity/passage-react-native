import { UserSocialConnections } from 'src/PassageCurrentUser';

export enum DisplayUnit {
  Seconds = 's',
  Minutes = 'm',
  Hours = 'h',
  Days = 'd',
}

export type EmailAndSMSAuthMethod = {
  ttl: number;
  ttl_display_unit: DisplayUnit;
};

export type AuthMethods = {
  passkeys?: Record<string, never>;
  otp?: EmailAndSMSAuthMethod;
  magicLink?: EmailAndSMSAuthMethod;
};

export type UserMetadataField = {
  fieldName: string;
  friendlyName: string;
  id: string;
  profile: boolean;
  registration: boolean;
  type: string;
};

export type PassageAppInfo = {
  allowedIdentifier: string;
  authMethods: AuthMethods;
  authOrigin: string;
  defaultLanguage: string;
  ephemeral: boolean;
  id: string;
  loginUrl: string;
  name: string;
  passageBranding: boolean;
  publicSignup: boolean;
  profileManagement: boolean;
  redirectUrl: string;
  requireEmailVerification: boolean;
  requireIdentifierVerification: boolean;
  requiredIdentifier: string;
  rsaPublicKey: string;
  sessionTimeoutLength: number;
  socialConnections: UserSocialConnections;
  userMetadataSchema: Array<UserMetadataField>;
};
