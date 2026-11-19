# Hospital Inventory & Supply Management System (HISMS)

A full-stack web app for tracking a hospital's medical supplies: what's on hand, what's running low, what's been ordered, and which department used what.

Built for **CSE 412: Database Management** at Arizona State University.

## Demo Video
https://www.youtube.com/watch?v=RRPWCC7hH_s 

## Features

- **Dashboard:** total items, total stock units, pending orders, and staff count at a glance, plus a **low-stock alert** listing every item at or below its reorder level and how many units are needed.
- **Inventory:** add, edit, and delete supply items, with search, category filter, and a stock-level indicator for each item.
- **Purchase orders:** create orders against a supplier, track status (Pending → Approved → Delivered / Cancelled), and see who created each one.
- **Stock transactions:** log additions, usage, and transfers by item, department, and staff member, newest first.
- **Departments, suppliers, and users:** full create/read/update/delete, including role-based users (Admin, Department Head, Procurement Officer) and a department manager for each department.
- **SQL audit trail:** the API logs every SQL statement it runs, with its parameters, in real time.

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19 (Create React App) |
| API      | Node.js, Express 5, REST |
| Database | PostgreSQL (`pg` driver) |

## Database design

Seven related tables: `item`, `category`, `purchaseorder`, `supplier`, `department`, `"User"`, and `stocktransaction`. The full schema is in [`schema.sql`](schema.sql).

```
category ──< item ──< stocktransaction >── department
                              │                  │
                              └──── "User" ──────┘ (department manager)
                                      │
supplier ──< purchaseorder >──────────┘ (created by)
```

- Read endpoints use multi-table `JOIN`s. For example, the stock-transaction history joins four tables so each row shows the item, department, and staff member by name.
- Every query that takes user input is **parameterized** (`$1, $2, ...`) to prevent SQL injection.
- Constraints enforce valid order statuses, transaction types, roles, and non-negative stock levels.

## Running it locally

**Prerequisites:** Node.js 20.6+ and PostgreSQL.

1. **Create the database**
   ```bash
   createdb hisms
   psql -d hisms -f schema.sql
   ```

2. **Start the API** (runs on http://localhost:3001)
   ```bash
   cd backend
   cp .env.example .env      # then set DB_PASSWORD in .env
   npm install
   npm start
   ```

3. **Start the frontend** (opens http://localhost:3000)
   ```bash
   cd frontend
   npm install
   npm start
   ```

## API endpoints

| Resource | Endpoints |
|----------|-----------|
| Items | `GET/POST /api/items`, `PUT/DELETE /api/items/:id` |
| Categories | `GET /api/categories` |
| Purchase orders | `GET/POST /api/orders`, `PUT/DELETE /api/orders/:id` |
| Stock transactions | `GET/POST /api/transactions`, `DELETE /api/transactions/:id` |
| Departments | `GET/POST /api/departments`, `PUT/DELETE /api/departments/:id` |
| Suppliers | `GET/POST /api/suppliers`, `PUT/DELETE /api/suppliers/:id` |
| Users | `GET/POST /api/users`, `PUT/DELETE /api/users/:id` |
