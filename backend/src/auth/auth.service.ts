import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';

// Use require to get openid-client dynamically
const openid = require('openid-client');

@Injectable()
export class AuthService {
  private client: any;
  private readonly logger = new Logger(AuthService.name);

  async getCognitoClient() {
    if (!this.client) {
      const poolId = process.env.AWS_COGNITO_USER_POOL_ID;
      const clientId = process.env.AWS_COGNITO_CLIENT_ID;
      const region = process.env.AWS_REGION;

      if (!poolId || !region || !clientId) {
        this.logger.error('Missing required Cognito environment variables');
        throw new Error('Missing Cognito environment configuration');
      }

      try {
        const issuerUrl = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
        const issuer = await openid.Issuer.discover(issuerUrl);

        this.logger.log(`Discovered issuer from ${issuerUrl}`);

        this.client = new issuer.Client({
          client_id: clientId,
        });
      } catch (err) {
        this.logger.error('Error discovering issuer or creating client', err);
        throw new UnauthorizedException('Failed to initialize Cognito client');
      }
    }

    return this.client;
  }

  async validateToken(token: string) {
    const client = await this.getCognitoClient();
    try {
      const userInfo = await client.userinfo(token);
      return userInfo;
    } catch (err) {
      this.logger.error('Token validation failed', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
