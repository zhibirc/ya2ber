CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    user_name     VARCHAR(20) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_role     TEXT DEFAULT 'user' NOT NULL, -- assumed, that there will be 2 roles: 'user' and 'admin'
    signup_date   timestamptz NOT NULL,         -- registration date
    last_visit    timestamptz NOT NULL,
    last_ip       inet,                         -- IP address used by user on last visit
    active        BOOL DEFAULT TRUE NOT NULL    -- special flag depended on application business logic
);

CREATE INDEX users_username_index ON users (user_name);
