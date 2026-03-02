export type AppRole = 'ADMIN' | 'USER';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: AppRole;
};

export type AuthState = {
  user: AuthUser | null;
  initialized: boolean;
};
