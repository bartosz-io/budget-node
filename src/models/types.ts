export const ROLES = ['OWNER', 'READER'] as const;
export type Id = string | undefined;
export type UserRole = typeof ROLES[number];