export const APP_ROLE_ENUM = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type AppRole = (typeof APP_ROLE_ENUM)[keyof typeof APP_ROLE_ENUM];
