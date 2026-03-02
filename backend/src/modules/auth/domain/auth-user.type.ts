import type { AppRole } from './role.type';

export type AuthUser = {
  sub: string;
  email: string;
  username: string;
  role: AppRole;
};
