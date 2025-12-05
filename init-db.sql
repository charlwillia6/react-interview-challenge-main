-- CREATE TABLE
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_number INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL,
    credit_limit INTEGER
);

-- Add a transaction table so we can later compute the daily withdrawals
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_number INTEGER REFERENCES accounts(account_number),
    type VARCHAR NOT NULL, -- 'withdraw' or 'deposit'
    amount INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE accounts ADD CONSTRAINT verify_type
CHECK (type IN ('checking', 'savings', 'credit'));

-- LOAD DATAS
INSERT INTO accounts 
    (account_number, name, amount, type)
VALUES
    (1, 'Johns Checking', 1000, 'checking'),
    (2, 'Janes Savings', 2000, 'savings'),
    (4, 'Bobs Checking', 40000, 'checking'),
    (5, 'Bills Savings', 50000, 'savings'),
    (7, 'Nancy Checking', 70000, 'checking'),
    (8, 'Nancy Savings', 80000, 'savings'),
    (10, 'Test Low Checking', 50, 'checking'); -- Account with very low balance for testing

INSERT INTO accounts
    (account_number, name, amount, type, credit_limit)
VALUES
    (3, 'Jills Credit', -3000, 'credit', 10000),
    (6, 'Bills Credit', -60000, 'credit', 60000),
    (9, 'Nancy Credit', -90000, 'credit', 100000),
    (11, 'Test Low Credit', -200, 'credit', 500); -- Account with low credit balance and limit for testing