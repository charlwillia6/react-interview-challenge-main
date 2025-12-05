import { query } from "../utils/db";
import { getAccount } from "./accountHandler";
import { Account, validateWithdrawal, validateDeposit } from "../utils/transactionRules";
import { getTodaysWithdrawnTotal } from "../utils/transactionHistory";

export const withdrawal = async (accountID: string, amount: number) => {
  const accountRow = await getAccount(accountID);
  const account = accountRow as Account;

  const todaysWithdrawn = await getTodaysWithdrawnTotal(accountID);

  validateWithdrawal(account, amount, todaysWithdrawn);

  const newAmount = account.amount - amount;

  const res = await query(
    `
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2
    `,
    [newAmount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  await query(
    `
    INSERT INTO transactions (account_number, type, amount)
    VALUES ($1, 'withdraw', $2)
    `,
    [accountID, amount]
  );

  return { ...account, amount: newAmount };
};

export const deposit = async (accountID: string, amount: number) => {
  const accountRow = await getAccount(accountID);
  const account = accountRow as Account;

  validateDeposit(account, amount);

  const newAmount = account.amount + amount;

  const res = await query(
    `
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2
    `,
    [newAmount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  await query(
    `
    INSERT INTO transactions (account_number, type, amount)
    VALUES ($1, 'deposit', $2)
    `,
    [accountID, amount]
  );

  return { ...account, amount: newAmount };
};