import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No authorization header present');
      throw new UnauthorizedException('No authorization header');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      this.logger.warn(`Invalid authorization header format: ${authHeader}`);
      throw new UnauthorizedException('Invalid authorization header format');
    }

    this.logger.log(`Received token: ${token.substring(0, 10)}...`);

    try {
      const user = await this.authService.validateToken(token);
      this.logger.log(`Token validated successfully for user: ${user.email || user.sub || 'unknown'}`);
      request.user = user; // Attach user info to request object
      return true;
    } catch (error) {
      this.logger.error('Token validation failed', error.stack);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
