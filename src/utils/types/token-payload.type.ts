export type NewUserTokenPayload = {
  id: number;
  employee: {
    name: string;
    position: {
      name: string;
    };
  };
  authLogId: number;
};

export type TokenPayload = {
  id: number;
  username: string;
  authLogId: number;
};
