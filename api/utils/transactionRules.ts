export type Account = {
  account_number: number;
  name: string;
  amount: number;
  type: "checking" | "savings" | "credit";
  credit_limit: number | null;
};

export const validateWithdrawal = (
  account: Account,
  amount: number,
  todaysWithdrawn: number
): void => {
  if (amount <= 0) {
    throw new Error("Withdrawal amount must be greater than 0");
  }

  if (amount > 200) {
    throw new Error("Cannot withdraw more than $200 in a single transaction");
  }

  if (todaysWithdrawn + amount > 400) {
    throw new Error("Cannot withdraw more than $400 in a single day");
  }

  if (amount % 5 !== 0) {
    throw new Error("Withdrawal amount must be in increments of $5");
  }

  const newBalance = account.amount - amount;

  if (account.type === "credit") {
    const limit = account.credit_limit ?? 0;
    if (newBalance < -limit) {
      throw new Error("Cannot withdraw more than the credit limit");
    }
  } else {
    if (newBalance < 0) {
      throw new Error("Cannot withdraw more than the account balance");
    }
  }
};

export const validateDeposit = (account: Account, amount: number): void => {
  if (amount <= 0) {
    throw new Error("Deposit amount must be greater than 0");
  }

  if (amount > 1000) {
    throw new Error("Cannot deposit more than $1000 in a single transaction");
  }

  if (account.type === "credit") {
    const newBalance = account.amount + amount;
    if (newBalance > 0) {
      throw new Error("Cannot deposit more than needed to pay off the credit account");
    }
  }
};