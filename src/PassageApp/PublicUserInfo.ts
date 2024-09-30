import { UserStatus, WebAuthnType } from 'src/PassageCurrentUser';

export type PublicUserInfo = {
  email: string;
  emailVerified: boolean;
  id: string;
  phone: string;
  phoneVerified: boolean;
  status: UserStatus;
  userMetadata: object | null;
  webauthn: boolean;
  webauthnTypes: Array<WebAuthnType>;
};
