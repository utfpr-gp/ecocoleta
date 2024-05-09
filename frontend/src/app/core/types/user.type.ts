export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf?: string;
  picture?: string;
  role: string;
  token: string;
  createdAt: string;
  updatedAt: string;
};

export type WasteCollector = {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  cpf?: number;
  picture?: string;
  role?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
};
