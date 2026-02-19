export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthToken = {
  token: string;
};

export type RegisterClientPayload = {
  email: string;
  password: string;
  phone: string;
  accepts_marketing: boolean;
  first_name: string;
  last_name: string;
  username: string;
};

export type RegisterClientResponse = {
  id: string;
  email: string;
  role_id: string;
};

export type RegisterSellerPayload = RegisterClientPayload & {
  company_name: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  role_id?: string;
};

export type RefreshPayload = Record<string, unknown>;

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};

export type LogoutResponse = string;
