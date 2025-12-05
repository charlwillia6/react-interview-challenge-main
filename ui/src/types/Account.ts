export type AccountType = "checking" | "savings" | "credit";

export type Account = {
  accountNumber: number;
  name: string;
  amount: number;
  type: AccountType;
  creditLimit: number | null;
};
