import { query } from "./db";

export const getTodaysWithdrawnTotal = async (accountID: string): Promise<number> => {
  const res = await query(
    `
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE account_number = $1
      AND type = 'withdraw'
      AND created_at::date = CURRENT_DATE
    `,
    [accountID]
  );

  return Number(res.rows[0].total) || 0;
};