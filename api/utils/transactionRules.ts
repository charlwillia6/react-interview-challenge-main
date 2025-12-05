import type { Account } from "../types/Account";

const MAX_WITHDRAWAL_PER_TRANSACTION = 200;
const MAX_WITHDRAWAL_PER_DAY = 400;
const WITHDRAWAL_INCREMENT = 5;
const MAX_DEPOSIT_PER_TRANSACTION = 1000;

const ensurePositiveAmount = (amount: number, context: "Withdrawal" | "Deposit") => {
  if (amount <= 0) {
    throw new Error(`${context} amount must be greater than 0`);
  }
};

export const validateWithdrawal = (
  account: Account,
  amount: number,
  todaysWithdrawn: number
): void => {
  ensurePositiveAmount(amount, "Withdrawal");

  if (amount > MAX_WITHDRAWAL_PER_TRANSACTION) {
    throw new Error(
      `Cannot withdraw more than $${MAX_WITHDRAWAL_PER_TRANSACTION} in a single transaction`
    );
  }

  if (todaysWithdrawn + amount > MAX_WITHDRAWAL_PER_DAY) {
    throw new Error(
      `Cannot withdraw more than $${MAX_WITHDRAWAL_PER_DAY} in a single day`
    );
  }

  if (amount % WITHDRAWAL_INCREMENT !== 0) {
    throw new Error(
      `Withdrawal amount must be in increments of $${WITHDRAWAL_INCREMENT}`
    );
  }

  const newBalance = account.amount - amount;

  if (account.type === "credit") {
    if (account.creditLimit == null) {
      throw new Error("Credit limit not configured");
    }

    const limit = account.creditLimit;

    if (newBalance < -limit) {
      throw new Error("Cannot withdraw more than the credit limit");
    }
  } else if (newBalance < 0) {
    throw new Error("Cannot withdraw more than the account balance");
  }
};

export const validateDeposit = (account: Account, amount: number): void => {
  ensurePositiveAmount(amount, "Deposit");

  if (amount > MAX_DEPOSIT_PER_TRANSACTION) {
    throw new Error(
      `Cannot deposit more than $${MAX_DEPOSIT_PER_TRANSACTION} in a single transaction`
    );
  }

  if (account.type === "credit") {
    const newBalance = account.amount + amount;

    if (newBalance > 0) {
      throw new Error(
        "Cannot deposit more than needed to pay off the credit account"
      );
    }
  }
};