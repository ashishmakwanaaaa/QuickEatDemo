// src/guards/auth.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token'];
    console.log(request, 'TOKEN>>>>>>>.');
    if (!token) {
      return false;
    }

    return this.authService.verifyToken(token);
  }
}
