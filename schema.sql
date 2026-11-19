-- HISMS database schema (PostgreSQL)
-- Create the database first:  CREATE DATABASE hisms;
-- Then run:                   psql -U postgres -d hisms -f schema.sql

CREATE TABLE category (
    categoryid   SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE "User" (
    userid       SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    role         VARCHAR(50)  NOT NULL
                 CHECK (role IN ('Admin', 'Department Head', 'Procurement Officer'))
);

CREATE TABLE department (
    departmentid SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    location     VARCHAR(255),
    manageuserid INTEGER REFERENCES "User"(userid) ON DELETE SET NULL
);

CREATE TABLE supplier (
    supplierid   SERIAL PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    contactname  VARCHAR(100),
    phone        VARCHAR(30),
    email        VARCHAR(255),
    address      TEXT
);

CREATE TABLE item (
    itemid         SERIAL PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    description    TEXT,
    unit           VARCHAR(30),
    quantityonhand INTEGER NOT NULL DEFAULT 0 CHECK (quantityonhand >= 0),
    reorderlevel   INTEGER NOT NULL DEFAULT 0 CHECK (reorderlevel >= 0),
    categoryid     INTEGER NOT NULL REFERENCES category(categoryid)
);

CREATE TABLE purchaseorder (
    orderid         SERIAL PRIMARY KEY,
    orderdate       DATE NOT NULL DEFAULT CURRENT_DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'Pending'
                    CHECK (status IN ('Pending', 'Approved', 'Delivered', 'Cancelled')),
    supplierid      INTEGER NOT NULL REFERENCES supplier(supplierid),
    createdbyuserid INTEGER NOT NULL REFERENCES "User"(userid)
);

CREATE TABLE stocktransaction (
    transactionid   SERIAL PRIMARY KEY,
    itemid          INTEGER NOT NULL REFERENCES item(itemid) ON DELETE CASCADE,
    departmentid    INTEGER NOT NULL REFERENCES department(departmentid),
    userid          INTEGER NOT NULL REFERENCES "User"(userid),
    transactiontype VARCHAR(20) NOT NULL CHECK (transactiontype IN ('Addition', 'Usage', 'Transfer')),
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    transactiondate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
