export type User = {
  readonly _id: string;
  email: string;
  password: string;
  isDeleted: boolean;
  accessToken: string;
};

export type UserWithToken = {
  user: {
    email: string;
    password: string;
  };
  token: string;
};

export type UserForCreate = Omit<User, "id" | "isDeleted">;

export type userForPresentation = Omit<User, "password" | "isDeleted">;

export type userForUpdate = {
  email: string;
  password: string;
};
