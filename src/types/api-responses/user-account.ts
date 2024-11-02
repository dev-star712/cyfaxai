export type AuthUserAccount = {
  id: string;
  is_admin: boolean;
  email: string;
  last_login: string;
  date_joined: string;
  created_at: string;
  full_name: string;
  phone: string;
  role:string;
  is_active: boolean;
  groups: [];
  permissions: [];
  role_name: string;
};
