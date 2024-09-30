export enum SocialConnectionType {
  apple = 'apple',
  github = 'github',
  google = 'google',
}

export type SocialConnection = {
  providerId: string;
  createdAt: Date;
  lastLoginAt: Date;
  providerIdentifier: string;
};

export interface UserSocialConnections {
  apple?: SocialConnection;
  github?: SocialConnection;
  google?: SocialConnection;
}
