// export type User = {
//   id?: string;
//   name: string;
//   email: string;
//   password?: string;
//   phone: string;
//   role?: string;
//   token?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

//generico
export type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  cpf?: number;
  cnpj?: number;
  picture?: string | File;
  role?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
};

// export type WasteCollector = {
//   id?: string;
//   name: string;
//   email: string;
//   password: string;
//   phone: number;
//   cpf?: number;
//   picture?: string;
//   role?: string;
//   token?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

// company
