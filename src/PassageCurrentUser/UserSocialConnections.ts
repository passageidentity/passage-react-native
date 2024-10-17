export enum UserSocialConnectionType {
  apple = 'apple',
  github = 'github',
  google = 'google',
}

export type UserSocialConnection = {
  providerId: string;
  createdAt: Date;
  lastLoginAt: Date;
  providerIdentifier: string;
};

export interface UserSocialConnections {
  apple?: UserSocialConnection;
  github?: UserSocialConnection;
  google?: UserSocialConnection;
}
