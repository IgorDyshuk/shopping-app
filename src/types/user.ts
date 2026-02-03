export type UserId = string | number;

export type User = {
  id: UserId;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
  role?: "seller" | "buyer";
  company_name?: string;
  accepts_marketing?: boolean;
  name?: {
    firstname?: string;
    lastname?: string;
  };
};

export type ClientProfile = {
  email: string;
  username: string;
  phone: string;
  accepts_marketing: boolean;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  id?: UserId;
  phone?: string;
  country?: string;
  role?: "seller" | "buyer";
  company_name?: string;
  name?: {
    firstname?: string;
    lastname?: string;
  };
};

export type UpdateUserPayload = {
  id: UserId;
  username: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  role?: "seller" | "buyer";
  name?: {
    firstname?: string;
    lastname?: string;
  };
};
