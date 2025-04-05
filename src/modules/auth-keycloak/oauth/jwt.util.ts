import { Algorithm, decode, verify } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

export class JwtUtil {
  verify(token: string, secret: string, algorihtm: Algorithm): any {
    return verify(token, secret, { algorithms: [algorihtm] });
  }

  decode<T = any>(token: string) {
    return decode(token) as T;
  }

  decodeComplete(token: string) {
    return decode(token, { complete: true });
  }

  toPem(key: any): string {
    return jwkToPem(key);
  }
}