// src/auth/guards/roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Logger,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);
  
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // no roles required
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      const userRole = user?.['custom:role'] || user?.role;
  
      this.logger.log(
        `User role: ${userRole} | Required: ${requiredRoles.join(', ')}`
      );
  
      if (!userRole || !requiredRoles.includes(userRole)) {
        throw new ForbiddenException('You do not have permission (role mismatch)');
      }
  
      return true;
    }
  }
  