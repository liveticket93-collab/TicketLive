export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  profile_photo?: string | null;
  profile_photo_id?: string;
  birthday?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}