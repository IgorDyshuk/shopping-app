export type User = {
  id: number;
  username: string;
  email: string;
  // Password may not be returned from every endpoint; keep optional on the entity
  password?: string;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  id?: number;
};

export type UpdateUserPayload = {
  id: number;
  username: string;
  email: string;
  password: string;
};
