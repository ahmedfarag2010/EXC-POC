/**
 * Authentication Models
 */
export interface LoginDto {
  email: string | null;
  password: string | null;
}

export interface RegisterDto {
  fullName: string | null;
  email: string | null;
  password: string | null;
  managerId: string | null; // UUID
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  managerId?: string;
}
