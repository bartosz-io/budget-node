export const ROLES = ['OWNER', 'READER', 'ADMIN'] as const;
export type Id = string | undefined;
export type UserRole = typeof ROLES[number];