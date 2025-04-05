import { OAuthService } from './oauth.service';
import { OauthJwkOptions } from './oauth.types';
import { JwtUtil } from './jwt.util';
import { Algorithm, JwtHeader } from 'jsonwebtoken';
import { HttpClient } from './http-client';

export class OauthJwkService extends OAuthService {
  private keys: JwtHeader[] = [];
  private pems: Record<string, string> = {};

  constructor(
    protected options: OauthJwkOptions,
    protected jwtUtil: JwtUtil,
    protected httpClient: HttpClient,
  ) {
    super(options, httpClient);
  }

  protected async initializeConfiguration(): Promise<void>
  {
    await super.initializeConfiguration();
    return this.refresh();
  }

  async verify(token: string): Promise<boolean> {
    // Decode token and get kid and alg
    const decode = this.jwtUtil.decodeComplete(token);
    if (!decode?.header) return false;

    const { kid, alg } = decode.header;
    if (!kid) return false;

    // Get pem from cache or convert key to pem
    let pem = this.pems[kid];
    if (!pem) {
      const key = this.keys.find((k) => k.kid === kid);
      pem = this.jwtUtil.toPem(key);
      this.pems[kid] = pem;
    }

    // Verify token
    return this.jwtUtil.verify(token, pem, alg as Algorithm);
  }

  private async refresh() {
    // Get keys from JWKS URI and cache it
    const response = await this.httpClient.get<{ keys: JwtHeader[] }>(
      this.configuration.jwks_uri,
    );
    this.pems = {};
    this.keys = response.data.keys;
  }
}