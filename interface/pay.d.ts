export type PayAPIRequest = {
  email: string;
  amount: number;
  note: string;
  token: string;
};

export type PayAPIResponse = {
  success: boolean;
};