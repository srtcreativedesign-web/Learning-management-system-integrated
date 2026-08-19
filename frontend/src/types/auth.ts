export type UserRole = 'SUPER_ADMIN' | 'HRBP_MANAGER' | 'TRAINER' | 'AUDITOR';

export interface UserAuth {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  current_rank?: string;
  total_xp?: number;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  HRBP_MANAGER: 'Manager HRBP',
  TRAINER: 'Trainer TnD',
  AUDITOR: 'Auditor Lapangan',
};

export const ROLE_BADGES: Record<UserRole, { label: string; color: string; bg: string; border: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  HRBP_MANAGER: {
    label: 'Manager HRBP',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  TRAINER: {
    label: 'Trainer',
    color: 'text-[#419CC3]',
    bg: 'bg-[#419CC3]/10',
    border: 'border-[#419CC3]/30',
  },
  AUDITOR: {
    label: 'Auditor',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

export function canAccessTraining(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'HRBP_MANAGER' || role === 'TRAINER';
}

export function canAccessAudit(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'HRBP_MANAGER' || role === 'AUDITOR';
}

export function canAccessAll(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'HRBP_MANAGER';
}
