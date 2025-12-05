import { query } from "../utils/db";
import type { Account, AccountType } from "../../types/shared/Account";

type AccountRow = {
  account_number: number;
  name: string;
  amount: number;
  type: string;
  credit_limit: number | null;
};

const mapAccountRowToAccount = (row: AccountRow): Account => ({
  accountNumber: row.account_number,
  name: row.name,
  amount: row.amount,
  type: row.type as AccountType,
  creditLimit: row.credit_limit,
});

export const getAccount = async (accountID: string): Promise<Account> => {
  const res = await query(`
    SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`,
    [accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Account not found");
  }

  return mapAccountRowToAccount(res.rows[0] as AccountRow);
};