import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MainAuthGuard } from '../auth.guard';
import { RoleGuard } from '../role.guard';

export const RequirePerms = (...perms: string[]) =>
  applyDecorators(
    SetMetadata('perms', perms),
    UseGuards(MainAuthGuard, RoleGuard),
  );
