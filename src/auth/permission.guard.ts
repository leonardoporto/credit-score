import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class PermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtGuard = new JwtAuthGuard();
    await jwtGuard.canActivate(context);

    const { user, params } = context.switchToHttp().getRequest();

    if (user.role === Role.Admin) {
      return true;
    }

    return user.userId === params.id;
  }
}
