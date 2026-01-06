export type User = {
  id: number;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
  role?: "seller" | "buyer";
  name?: {
    firstname?: string;
    lastname?: string;
  };
};

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  id?: number;
  phone?: string;
  country?: string;
  role?: "seller" | "buyer";
  name?: {
    firstname?: string;
    lastname?: string;
  };
};

export type UpdateUserPayload = {
  id: number;
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
