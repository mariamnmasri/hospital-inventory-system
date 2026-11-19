const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database settings come from environment variables (see .env.example).
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'hisms',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

// ── helper: run query and log it ──
async function query(sql, params = []) {
  console.log('\n--- SQL EXECUTED ---');
  console.log(sql.replace(/\s+/g, ' ').trim());
  if (params.length) console.log('PARAMS:', params);
  console.log('--------------------');
  return pool.query(sql, params);
}

// ── items ──
app.get('/api/items', async (req, res) => {
  try {
    const result = await query(`
      SELECT i.itemid, i.name, i.description, i.unit,
             i.quantityonhand, i.reorderlevel,
             i.categoryid,
             c.name AS categoryname
      FROM item i
      JOIN category c ON i.categoryid = c.categoryid
      ORDER BY i.name
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/items', async (req, res) => {
  const { name, description, unit, quantityonhand, reorderlevel, categoryid } = req.body;
  try {
    await query(
      `INSERT INTO item (name, description, unit, quantityonhand, reorderlevel, categoryid)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, description, unit, quantityonhand, reorderlevel, categoryid]
    );
    res.status(201).json({ status: 'created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/items/:id', async (req, res) => {
  const { name, description, unit, quantityonhand, reorderlevel, categoryid } = req.body;
  try {
    await query(
      `UPDATE item SET name=$1, description=$2, unit=$3, quantityonhand=$4, reorderlevel=$5, categoryid=$6
       WHERE itemid=$7`,
      [name, description, unit, quantityonhand, reorderlevel, categoryid, req.params.id]
    );
    res.json({ status: 'updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await query(`DELETE FROM item WHERE itemid=$1`, [req.params.id]);
    res.json({ status: 'deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── categories ──
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM category ORDER BY name`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── users ──
app.get('/api/users', async (req, res) => {
  try {
    const result = await query(`SELECT userid, name, email, role FROM "User" ORDER BY name`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await query(
      `INSERT INTO "User" (name, email, password, role) VALUES ($1, $2, 'hashed_pw', $3)`,
      [name, email, role]
    );
    res.status(201).json({ status: 'created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await query(
      `UPDATE "User" SET name=$1, email=$2, role=$3 WHERE userid=$4`,
      [name, email, role, req.params.id]
    );
    res.json({ status: 'updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await query(`DELETE FROM "User" WHERE userid=$1`, [req.params.id]);
    res.json({ status: 'deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── departments ──
app.get('/api/departments', async (req, res) => {
  try {
    const result = await query(`
      SELECT d.departmentid, d.name, d.location, d.manageuserid,
             u.name AS managername
      FROM department d
      LEFT JOIN "User" u ON d.manageuserid = u.userid
      ORDER BY d.name
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/departments', async (req, res) => {
  const { name, location, manageuserid } = req.body;
  try {
    await query(
      `INSERT INTO department (name, location, manageuserid) VALUES ($1, $2, $3)`,
      [name, location, manageuserid || null]
    );
    res.status(201).json({ status: 'created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/departments/:id', async (req, res) => {
  const { name, location, manageuserid } = req.body;
  try {
    await query(
      `UPDATE department SET name=$1, location=$2, manageuserid=$3 WHERE departmentid=$4`,
      [name, location, manageuserid || null, req.params.id]
    );
    res.json({ status: 'updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await query(`DELETE FROM department WHERE departmentid=$1`, [req.params.id]);
    res.json({ status: 'deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── suppliers ──
app.get('/api/suppliers', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM supplier ORDER BY name`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/suppliers', async (req, res) => {
  const { name, contactname, phone, email, address } = req.body;
  try {
    await query(
      `INSERT INTO supplier (name, contactname, phone, email, address) VALUES ($1,$2,$3,$4,$5)`,
      [name, contactname, phone, email, address]
    );
    res.status(201).json({ status: 'created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/suppliers/:id', async (req, res) => {
  const { name, contactname, phone, email, address } = req.body;
  try {
    await query(
      `UPDATE supplier SET name=$1, contactname=$2, phone=$3, email=$4, address=$5 WHERE supplierid=$6`,
      [name, contactname, phone, email, address, req.params.id]
    );
    res.json({ status: 'updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    await query(`DELETE FROM supplier WHERE supplierid=$1`, [req.params.id]);
    res.json({ status: 'deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── purchase orders ──
app.get('/api/orders', async (req, res) => {
  try {
    const result = await query(`
      SELECT po.orderid, po.orderdate, po.status, po.supplierid,
             s.name AS suppliername,
             u.name AS createdby
      FROM purchaseorder po
      JOIN supplier s ON po.supplierid = s.supplierid
      JOIN "User" u ON po.createdbyuserid = u.userid
      ORDER BY po.orderdate DESC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  const { orderdate, status, supplierid, createdbyuserid } = req.body;
  try {
    await query(
      `INSERT INTO purchaseorder (orderdate, status, supplierid, createdbyuserid) VALUES ($1,$2,$3,$4)`,
      [orderdate, status, supplierid, createdbyuserid]
    );
    res.status(201).json({ status: 'created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    await query(
      `UPDATE purchaseorder SET status=$1 WHERE orderid=$2`,
      [req.body.status, req.params.id]
    );
    res.json({ status: 'updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await query(`DELETE FROM purchaseorder WHERE orderid=$1`, [req.params.id]);
    res.json({ status: 'deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── stock transactions ──
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await query(`
      SELECT st.transactionid, st.transactiontype, st.quantity, st.transactiondate,
             i.name AS itemname,
             d.name AS departmentname,
             u.name AS username
      FROM stocktransaction st
      JOIN item i ON st.itemid = i.itemid
      JOIN department d ON st.departmentid = d.departmentid
      JOIN "User" u ON st.userid = u.userid
      ORDER BY st.transactiondate DESC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/transactions', async (req, res) => {
  const { itemid, departmentid, userid, transactiontype, quantity } = req.body;
  try {
    await query(
      `INSERT INTO stocktransaction (itemid, departmentid, userid, transactiontype, quantity)
       VALUES ($1,$2,$3,$4,$5)`,
      [itemid, departmentid, userid, transactiontype, quantity]
    );
    res.status(201).json({ status: 'created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await query(`DELETE FROM stocktransaction WHERE transactionid=$1`, [req.params.id]);
    res.json({ status: 'deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`HISMS server running on http://localhost:${PORT}`);
});