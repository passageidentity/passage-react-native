export type AuthResult = {
  authToken: string;
  redirectUrl: string;
  refreshToken: string | null;
  refreshTokenExpiration: number | null;
};
