# ATM Rules Test Plan

This file describes manual test cases to verify the withdrawal and deposit rules implemented in the ATM project.

## Setup

1. From the project root, build and start the stack:

   ```bash
   docker compose build
   docker compose up -d
   ```

2. The database is initialized from `init-db.sql` with these example accounts:

   - Account `1`: `Johns Checking`, balance `1000`, type `checking`
   - Account `2`: `Janes Savings`, balance `2000`, type `savings`
   - Account `3`: `Jills Credit`, balance `-3000`, type `credit`, credit limit `10000`
   - Account `10`: `Test Low Checking`, balance `50`, type `checking`
   - Account `11`: `Test Low Credit`, balance `-200`, type `credit`, credit limit `500`

3. Open the UI in a browser (see `docker-compose.yml` for the UI port, typically `http://localhost:3001`).

4. Sign in by entering an account number (e.g. `1`, `2`, or `3`).

---

## 1. Withdrawal Rules

### 1.1 Per-transaction limit ($200)

- **Steps**
  - Sign in with account `1` (Johns Checking).
  - Attempt to withdraw `205`.
- **Expected**
  - Request fails.
  - UI shows an error message containing:
    - `Cannot withdraw more than $200 in a single transaction`.
  - Account balance does **not** change.

### 1.2 Daily withdrawal limit ($400)

- **Steps**
  - Sign in with account `1`.
  - Withdraw `200`.
  - Withdraw another `200`.
  - Attempt a third withdrawal of `5` on the same day.
- **Expected**
  - The first two withdrawals succeed (assuming sufficient balance).
  - The third withdrawal fails with an error containing:
    - `Cannot withdraw more than $400 in a single day`.
  - Balance after the failed attempt is unchanged from after the second withdrawal.

### 1.3 $5 bill increments

- **Steps**
  - Sign in with account `1`.
  - Attempt to withdraw `7`.
- **Expected**
  - Request fails.
  - Error message contains:
    - `Withdrawal amount must be in increments of $5`.
  - Balance is unchanged.

### 1.4 Cannot withdraw more than balance (non-credit)

- **Steps**
  - Sign in with account `10` (Test Low Checking, balance `50`).
  - Attempt to withdraw `60` (greater than the current balance, but still ≤ 200 and within the daily limit).
- **Expected**
  - Request fails.
  - Error message contains:
    - `Cannot withdraw more than the account balance`.
  - Balance remains `50`.

### 1.5 Credit account cannot exceed credit limit

- **Steps**
  - Sign in with the low-limit credit test account (e.g., account `11`, `Test Low Credit`).
  - Choose a withdrawal amount that:
    - Is **≤ 200** (so it is allowed by the per-transaction rule), and
    - Would cause the resulting balance to go **below** `-credit_limit` for that account.
    - For example, if the account is seeded with a balance close to `-credit_limit`, a withdrawal of `100` may be enough to exceed the limit.
- **Expected**
  - Request fails.
  - Error message contains:
    - `Cannot withdraw more than the credit limit`.
  - Balance remains unchanged from before the withdrawal.

---

## 2. Deposit Rules

### 2.1 Per-transaction deposit limit ($1000)

- **Steps**
  - Sign in with account `1`.
  - Deposit `1000`.
  - Then attempt to deposit `1500` (or any amount > `1000`).
- **Expected**
  - Deposit of `1000` succeeds and balance increases by `1000`.
  - Deposit > `1000` fails.
  - Error message contains:
    - `Cannot deposit more than $1000 in a single transaction`.
  - On the failing attempt, the balance remains unchanged.

### 2.2 Credit account cannot be overpaid above 0

- **Steps**
  - Sign in with account `11` (Test Low Credit, balance `-200`, credit limit `500`).
  - Deposit `150`.
    - Expected new balance: `-50`.
  - Then attempt to deposit `100` (which would bring balance from `-50` to `+50`).
- **Expected**
  - First deposit of `150` succeeds; balance becomes `-50`.
  - Second deposit of `100` fails.
  - Error message contains:
    - `Cannot deposit more than needed to pay off the credit account`.
  - Balance remains `-50`.

---

## 3. Optional: API-Level Verification

These tests directly hit the API without going through the UI.

- **Check account details**

  ```bash
  curl http://localhost:3000/accounts/1
  ```

- **Test withdrawal limit error**

  ```bash
  curl -X PUT \
    -H "Content-Type: application/json" \
    -d '{"amount": 205}' \
    http://localhost:3000/transactions/1/withdraw
  ```

  - Expected: HTTP 400 with JSON body containing:
    - `{"error": "Cannot withdraw more than $200 in a single transaction"}` (or similar).

- **Test credit overpayment error**

  ```bash
  curl -X PUT \
    -H "Content-Type: application/json" \
    -d '{"amount": 6000}' \
    http://localhost:3000/transactions/3/deposit
  ```

  - If this would result in a positive balance, expected: HTTP 400 with JSON body containing:
    - `{"error": "Cannot deposit more than needed to pay off the credit account"}`.

This single file provides a manual checklist to confirm that all withdrawal and deposit rules behave as required.