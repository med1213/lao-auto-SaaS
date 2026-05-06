import { UserRole } from './enums';

export type JwtUser = {
  sub: string;
  email: string;
  role: UserRole;
  tenantId?: string;
};

