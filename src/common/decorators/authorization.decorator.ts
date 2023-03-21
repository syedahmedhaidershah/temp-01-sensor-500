import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../enums';
import { RolesGuard } from '../guards';

export const ROLES_KEY = 'roles';
export function Authorization(...roles: Role[]) {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
}
