export interface TokenResponse {
  accessToken: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  image: string;
  lastName: string;
  refreshToken: string;
  username: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
