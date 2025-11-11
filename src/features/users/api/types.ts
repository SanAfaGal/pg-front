export type UserRole = 'admin' | 'employee';

export interface User {
  username: string;
  email?: string;
  full_name?: string;
  role: UserRole;
  disabled: boolean;
}

export interface UserCreateInput {
  username: string;
  email?: string;
  full_name?: string;
  role: UserRole;
  password: string;
}

export interface UserUpdateInput {
  email?: string;
  full_name?: string;
}

export interface UserFilters {
  search?: string;
  role?: 'all' | UserRole;
  status?: 'all' | 'active' | 'disabled';
}

export interface PasswordResetInput {
  new_password: string;
  confirm_password: string;
}

