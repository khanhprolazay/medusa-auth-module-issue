export type OauthFlow = 'standard' | 'pkce' | 'client-credentials';

export type OauthOptions = {
  openidConfigurationUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  type: 'jwk' | 'introspect';
};

export type OpenIdConfiguration = {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  userinfo_endpoint: string;
  introspection_endpoint?: string;
  end_session_endpoint: string;
};

export type OauthUserInfor = {
  sub: string;
  name: string;
  email: string;
};


export type OauthJwkOptions = OauthOptions & {
  ttl?: number;
};

export type OauthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}