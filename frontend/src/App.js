import { useState, useEffect } from "react";

const API = "http://127.0.0.1:3001";

const COLORS = {
  bg: "#0f1117", surface: "#1a1d27", card: "#1e2130", border: "#2a2d3e",
  accent: "#4f8ef7", accentDim: "#1e3a6e", success: "#22c55e", successDim: "#14532d",
  warning: "#f59e0b", warningDim: "#451a03", danger: "#ef4444", dangerDim: "#450a0a",
  text: "#f1f5f9", textMuted: "#94a3b8", textDim: "#475569",
  purple: "#a78bfa", purpleDim: "#2d1b69", teal: "#2dd4bf", tealDim: "#042f2e",
};

const ROLE_COLOR = {
  Admin: { bg: COLORS.accentDim, text: COLORS.accent },
  "Department Head": { bg: COLORS.purpleDim, text: COLORS.purple },
  "Procurement Officer": { bg: COLORS.tealDim, text: COLORS.teal },
};

const STATUS_COLOR = {
  Pending: { bg: COLORS.warningDim, text: COLORS.warning },
  Approved: { bg: COLORS.accentDim, text: COLORS.accent },
  Delivered: { bg: COLORS.successDim, text: COLORS.success },
  Cancelled: { bg: "#1c1c1c", text: COLORS.textDim },
};

const TX_COLOR = {
  Addition: { bg: COLORS.successDim, text: COLORS.success },
  Usage: { bg: COLORS.dangerDim, text: COLORS.danger },
  Transfer: { bg: COLORS.purpleDim, text: COLORS.purple },
};

function Badge({ label, style }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.04em", ...style }}>
      {label}
    </span>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", style = {} }) {
  const base = {
    cursor: "pointer", border: "none", borderRadius: 6, fontWeight: 600,
    fontFamily: "inherit", transition: "all 0.15s", letterSpacing: "0.02em",
    fontSize: size === "sm" ? 12 : 13,
    padding: size === "sm" ? "4px 10px" : "8px 16px",
  };
  const variants = {
    primary: { background: COLORS.accent, color: "#fff" },
    danger: { background: COLORS.danger, color: "#fff" },
    ghost: { background: "transparent", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick}>{children}</button>;
}

function Input({ label, value, onChange, type = "text", options, required, placeholder }) {
  const inputStyle = {
    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: 6, color: COLORS.text, fontSize: 13, padding: "7px 10px",
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4, fontWeight: 600 }}>
        {label}{required && <span style={{ color: COLORS.danger }}> *</span>}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
          <option value="">— select —</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: COLORS.card, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 24, minWidth: 380, maxWidth: 480, width: "90%",
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: COLORS.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  const colors = { success: COLORS.success, error: COLORS.danger, info: COLORS.accent };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 2000,
      background: COLORS.card, border: `1px solid ${colors[type] || COLORS.border}`,
      borderRadius: 8, padding: "12px 18px", color: COLORS.text,
      fontSize: 13, fontWeight: 500,
    }}>
      <span style={{ color: colors[type], marginRight: 8 }}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      {message}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "16px 20px" }}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent || COLORS.text }}>{value}</div>
    </div>
  );
}

function TableHead({ cols }) {
  return (
    <thead>
      <tr>
        {cols.map(c => (
          <th key={c} style={{
            textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700,
            color: COLORS.textDim, letterSpacing: "0.08em", textTransform: "uppercase",
            borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface,
          }}>{c}</th>
        ))}
      </tr>
    </thead>
  );
}

const td = { padding: "10px 14px", fontSize: 13, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` };

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeModal = () => setModal(null);

  const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "items", label: "Inventory" },
    { id: "orders", label: "Purchase Orders" },
    { id: "users", label: "Users" },
    { id: "departments", label: "Departments" },
    { id: "suppliers", label: "Suppliers" },
    { id: "transactions", label: "Stock Transactions" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{
        background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 28px", display: "flex", alignItems: "center", gap: 20, height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: COLORS.accentDim,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: COLORS.accent,
          }}>H</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>HISMS</span>
          <span style={{ color: COLORS.textDim, fontSize: 13 }}>Hospital Inventory & Supply Management</span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge label="Mariam Masri · Admin" style={{ background: COLORS.accentDim, color: COLORS.accent }} />
        </div>
      </div>

      <div style={{
        background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 28px", display: "flex", gap: 2, overflowX: "auto",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "none", border: "none", padding: "14px 16px", fontSize: 13,
            fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
            color: activeTab === t.id ? COLORS.accent : COLORS.textMuted,
            borderBottom: `2px solid ${activeTab === t.id ? COLORS.accent : "transparent"}`,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
        {activeTab === "dashboard" && <DashboardPage showToast={showToast} />}
        {activeTab === "items" && <ItemsPage showToast={showToast} modal={modal} setModal={setModal} closeModal={closeModal} />}
        {activeTab === "orders" && <OrdersPage showToast={showToast} modal={modal} setModal={setModal} closeModal={closeModal} />}
        {activeTab === "users" && <UsersPage showToast={showToast} modal={modal} setModal={setModal} closeModal={closeModal} />}
        {activeTab === "departments" && <DeptPage showToast={showToast} modal={modal} setModal={setModal} closeModal={closeModal} />}
        {activeTab === "suppliers" && <SuppliersPage showToast={showToast} modal={modal} setModal={setModal} closeModal={closeModal} />}
        {activeTab === "transactions" && <TransactionsPage showToast={showToast} modal={modal} setModal={setModal} closeModal={closeModal} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

function DashboardPage({ showToast }) {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/items`).then(r => r.json()),
      fetch(`${API}/api/orders`).then(r => r.json()),
      fetch(`${API}/api/users`).then(r => r.json()),
    ]).then(([i, o, u]) => {
      setItems(i); setOrders(o); setUsers(u); setLoading(false);
    }).catch(() => { showToast("Could not load dashboard data", "error"); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  const lowStock = items.filter(i => i.quantityonhand <= i.reorderlevel);
  const totalUnits = items.reduce((s, i) => s + i.quantityonhand, 0);
  const pending = orders.filter(o => o.status === "Pending").length;

  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>Dashboard</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 24px" }}>Hospital Inventory & Supply Management System — Spring 2026</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Items (SKUs)" value={items.length} accent={COLORS.accent} />
        <StatCard label="Total Stock Units" value={totalUnits.toLocaleString()} accent={COLORS.teal} />
        <StatCard label="Low Stock Alerts" value={lowStock.length} accent={COLORS.danger} />
        <StatCard label="Pending Orders" value={pending} accent={COLORS.warning} />
        <StatCard label="Staff Members" value={users.length} />
      </div>

      {lowStock.length > 0 && (
        <div style={{ background: COLORS.dangerDim, border: `1px solid ${COLORS.danger}33`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.danger, marginBottom: 12 }}>
            ⚠ Low Stock Alert — {lowStock.length} item{lowStock.length > 1 ? "s" : ""} require reordering
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <TableHead cols={["Item", "Category", "On Hand", "Reorder Level", "Units Short"]} />
            <tbody>
              {lowStock.map(item => (
                <tr key={item.itemid}>
                  <td style={td}>{item.name}</td>
                  <td style={td}><Badge label={item.categoryname} style={{ background: COLORS.purpleDim, color: COLORS.purple }} /></td>
                  <td style={{ ...td, color: COLORS.danger, fontWeight: 600 }}>{item.quantityonhand}</td>
                  <td style={td}>{item.reorderlevel}</td>
                  <td style={{ ...td, color: COLORS.danger, fontWeight: 700 }}>{item.reorderlevel - item.quantityonhand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Recent Purchase Orders</div>
          {orders.slice(0, 5).map(o => (
            <div key={o.orderid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontSize: 13 }}>Order #{o.orderid} — {o.suppliername}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>{o.orderdate?.slice(0, 10)} · {o.createdby}</div>
              </div>
              <Badge label={o.status} style={STATUS_COLOR[o.status] || {}} />
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Stock Level Overview</div>
          {items.slice(0, 8).map(item => {
            const pct = Math.min(100, Math.round((item.quantityonhand / Math.max(item.reorderlevel * 2, 1)) * 100));
            const isLow = item.quantityonhand <= item.reorderlevel;
            return (
              <div key={item.itemid} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textMuted, marginBottom: 3 }}>
                  <span>{item.name}</span><span style={{ color: isLow ? COLORS.danger : COLORS.textMuted }}>{item.quantityonhand} {item.unit}</span>
                </div>
                <div style={{ background: COLORS.border, borderRadius: 4, height: 5 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: isLow ? COLORS.danger : COLORS.accent, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ItemsPage({ showToast, modal, setModal, closeModal }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [form, setForm] = useState({});
  const [editItem, setEditItem] = useState(null);

  const load = () => {
    Promise.all([
      fetch(`${API}/api/items`).then(r => r.json()),
      fetch(`${API}/api/categories`).then(r => r.json()),
    ]).then(([i, c]) => { setItems(i); setCategories(c); setLoading(false); })
      .catch(() => showToast("Failed to load items", "error"));
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filterCat || String(i.categoryid) === filterCat)
  );

  const openCreate = () => {
    setForm({ name: "", description: "", unit: "", quantityonhand: 0, reorderlevel: 0, categoryid: "" });
    setModal("create-item");
  };

  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setModal("edit-item"); };

  const handleCreate = async () => {
    if (!form.name || !form.categoryid) return showToast("Name and category required", "error");
    try {
      await fetch(`${API}/api/items`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantityonhand: Number(form.quantityonhand), reorderlevel: Number(form.reorderlevel), categoryid: Number(form.categoryid) }),
      });
      showToast(`Item "${form.name}" added`); closeModal(); load();
    } catch { showToast("Failed to create item", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/api/items/${editItem.itemid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantityonhand: Number(form.quantityonhand), reorderlevel: Number(form.reorderlevel) }),
      });
      showToast(`Item "${form.name}" updated`); closeModal(); load();
    } catch { showToast("Failed to update item", "error"); }
  };

  const handleDelete = async (item) => {
    try {
      await fetch(`${API}/api/items/${item.itemid}`, { method: "DELETE" });
      showToast(`Item "${item.name}" deleted`, "error"); load();
    } catch { showToast("Failed to delete item", "error"); }
  };

  const f = v => e => setForm(p => ({ ...p, [v]: e }));

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Inventory Items</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "4px 0 0" }}>{filtered.length} items</p>
        </div>
        <Button onClick={openCreate}>+ Add Item</Button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
          style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 13, padding: "7px 12px", fontFamily: "inherit", outline: "none" }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 13, padding: "7px 12px", fontFamily: "inherit", outline: "none" }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.categoryid} value={c.categoryid}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead cols={["ID", "Name", "Category", "Unit", "Qty On Hand", "Reorder Level", "Status", "Actions"]} />
          <tbody>
            {filtered.map(item => {
              const isLow = item.quantityonhand <= item.reorderlevel;
              return (
                <tr key={item.itemid} style={{ background: isLow ? `${COLORS.danger}08` : "transparent" }}>
                  <td style={{ ...td, color: COLORS.textDim }}>{item.itemid}</td>
                  <td style={{ ...td, fontWeight: 500 }}>{item.name}</td>
                  <td style={td}><Badge label={item.categoryname} style={{ background: COLORS.purpleDim, color: COLORS.purple }} /></td>
                  <td style={{ ...td, color: COLORS.textMuted }}>{item.unit}</td>
                  <td style={{ ...td, fontWeight: 600, color: isLow ? COLORS.danger : COLORS.success }}>{item.quantityonhand}</td>
                  <td style={{ ...td, color: COLORS.textMuted }}>{item.reorderlevel}</td>
                  <td style={td}>
                    {isLow
                      ? <Badge label="Low Stock" style={{ background: COLORS.dangerDim, color: COLORS.danger }} />
                      : <Badge label="OK" style={{ background: COLORS.successDim, color: COLORS.success }} />}
                  </td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(modal === "create-item" || modal === "edit-item") && (
        <Modal title={modal === "create-item" ? "Add New Item" : "Edit Item"} onClose={closeModal}>
          <Input label="Item Name" value={form.name} onChange={f("name")} required />
          <Input label="Description" value={form.description} onChange={f("description")} />
          <Input label="Unit" value={form.unit} onChange={f("unit")} placeholder="Box, Vial, Unit..." required />
          <Input label="Quantity On Hand" type="number" value={form.quantityonhand} onChange={f("quantityonhand")} />
          <Input label="Reorder Level" type="number" value={form.reorderlevel} onChange={f("reorderlevel")} />
          <Input label="Category" value={form.categoryid} onChange={f("categoryid")} required
            options={categories.map(c => ({ value: c.categoryid, label: c.name }))} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button onClick={modal === "create-item" ? handleCreate : handleUpdate} style={{ flex: 1 }}>
              {modal === "create-item" ? "Create Item" : "Save Changes"}
            </Button>
            <Button variant="ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OrdersPage({ showToast, modal, setModal, closeModal }) {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editOrder, setEditOrder] = useState(null);

  const load = () => {
    Promise.all([
      fetch(`${API}/api/orders`).then(r => r.json()),
      fetch(`${API}/api/suppliers`).then(r => r.json()),
      fetch(`${API}/api/users`).then(r => r.json()),
    ]).then(([o, s, u]) => { setOrders(o); setSuppliers(s); setUsers(u); setLoading(false); })
      .catch(() => showToast("Failed to load orders", "error"));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ orderdate: new Date().toISOString().split("T")[0], status: "Pending", supplierid: "", createdbyuserid: "" });
    setModal("create-order");
  };

  const openEdit = (o) => { setEditOrder(o); setForm({ ...o, supplierid: o.supplierid || "" }); setModal("edit-order"); };

  const handleCreate = async () => {
    if (!form.supplierid) return showToast("Supplier is required", "error");
    try {
      await fetch(`${API}/api/orders`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, supplierid: Number(form.supplierid), createdbyuserid: Number(form.createdbyuserid) }),
      });
      showToast("Purchase order created"); closeModal(); load();
    } catch { showToast("Failed to create order", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/api/orders/${editOrder.orderid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status }),
      });
      showToast("Order updated"); closeModal(); load();
    } catch { showToast("Failed to update order", "error"); }
  };

  const handleDelete = async (o) => {
    try {
      await fetch(`${API}/api/orders/${o.orderid}`, { method: "DELETE" });
      showToast(`Order #${o.orderid} deleted`, "error"); load();
    } catch { showToast("Failed to delete order", "error"); }
  };

  const f = v => e => setForm(p => ({ ...p, [v]: e }));

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Purchase Orders</h2>
        <Button onClick={openCreate}>+ New Order</Button>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead cols={["Order ID", "Date", "Supplier", "Created By", "Status", "Actions"]} />
          <tbody>
            {orders.map(o => (
              <tr key={o.orderid}>
                <td style={{ ...td, fontWeight: 600 }}>#{o.orderid}</td>
                <td style={td}>{o.orderdate?.slice(0, 10)}</td>
                <td style={td}>{o.suppliername}</td>
                <td style={{ ...td, color: COLORS.textMuted }}>{o.createdby}</td>
                <td style={td}><Badge label={o.status} style={STATUS_COLOR[o.status] || {}} /></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(o)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(o)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "create-order" || modal === "edit-order") && (
        <Modal title={modal === "create-order" ? "New Purchase Order" : "Edit Order"} onClose={closeModal}>
          <Input label="Order Date" type="date" value={form.orderdate} onChange={f("orderdate")} />
          <Input label="Status" value={form.status} onChange={f("status")}
            options={["Pending", "Approved", "Delivered", "Cancelled"].map(s => ({ value: s, label: s }))} />
          <Input label="Supplier" value={form.supplierid} onChange={f("supplierid")} required
            options={suppliers.map(s => ({ value: s.supplierid, label: s.name }))} />
          <Input label="Created By" value={form.createdbyuserid} onChange={f("createdbyuserid")}
            options={users.map(u => ({ value: u.userid, label: u.name }))} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button onClick={modal === "create-order" ? handleCreate : handleUpdate} style={{ flex: 1 }}>
              {modal === "create-order" ? "Create Order" : "Save Changes"}
            </Button>
            <Button variant="ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UsersPage({ showToast, modal, setModal, closeModal }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editUser, setEditUser] = useState(null);

  const load = () => {
    fetch(`${API}/api/users`).then(r => r.json())
      .then(u => { setUsers(u); setLoading(false); })
      .catch(() => showToast("Failed to load users", "error"));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: "", email: "", role: "Procurement Officer" }); setModal("create-user"); };
  const openEdit = (u) => { setEditUser(u); setForm({ ...u }); setModal("edit-user"); };

  const handleCreate = async () => {
    if (!form.name || !form.email) return showToast("Name and email required", "error");
    try {
      await fetch(`${API}/api/users`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast(`User "${form.name}" added`); closeModal(); load();
    } catch { showToast("Failed to create user", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/api/users/${editUser.userid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("User updated"); closeModal(); load();
    } catch { showToast("Failed to update user", "error"); }
  };

  const handleDelete = async (u) => {
    try {
      await fetch(`${API}/api/users/${u.userid}`, { method: "DELETE" });
      showToast(`User "${u.name}" deleted`, "error"); load();
    } catch { showToast("Failed to delete user", "error"); }
  };

  const f = v => e => setForm(p => ({ ...p, [v]: e }));

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Users</h2>
        <Button onClick={openCreate}>+ Add User</Button>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead cols={["ID", "Name", "Email", "Role", "Actions"]} />
          <tbody>
            {users.map(u => (
              <tr key={u.userid}>
                <td style={{ ...td, color: COLORS.textDim }}>{u.userid}</td>
                <td style={{ ...td, fontWeight: 500 }}>{u.name}</td>
                <td style={{ ...td, color: COLORS.textMuted }}>{u.email}</td>
                <td style={td}><Badge label={u.role} style={ROLE_COLOR[u.role] || {}} /></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(u)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "create-user" || modal === "edit-user") && (
        <Modal title={modal === "create-user" ? "Add User" : "Edit User"} onClose={closeModal}>
          <Input label="Full Name" value={form.name} onChange={f("name")} required />
          <Input label="Email" type="email" value={form.email} onChange={f("email")} required />
          <Input label="Role" value={form.role} onChange={f("role")}
            options={["Admin", "Department Head", "Procurement Officer"].map(r => ({ value: r, label: r }))} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button onClick={modal === "create-user" ? handleCreate : handleUpdate} style={{ flex: 1 }}>
              {modal === "create-user" ? "Create User" : "Save"}
            </Button>
            <Button variant="ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DeptPage({ showToast, modal, setModal, closeModal }) {
  const [depts, setDepts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editDept, setEditDept] = useState(null);

  const load = () => {
    Promise.all([
      fetch(`${API}/api/departments`).then(r => r.json()),
      fetch(`${API}/api/users`).then(r => r.json()),
    ]).then(([d, u]) => { setDepts(d); setUsers(u); setLoading(false); })
      .catch(() => showToast("Failed to load departments", "error"));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: "", location: "", manageuserid: "" }); setModal("create-dept"); };
  const openEdit = (d) => { setEditDept(d); setForm({ ...d }); setModal("edit-dept"); };

  const handleCreate = async () => {
    if (!form.name) return showToast("Name required", "error");
    try {
      await fetch(`${API}/api/departments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, manageuserid: form.manageuserid ? Number(form.manageuserid) : null }),
      });
      showToast(`Department "${form.name}" created`); closeModal(); load();
    } catch { showToast("Failed to create department", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/api/departments/${editDept.departmentid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, manageuserid: form.manageuserid ? Number(form.manageuserid) : null }),
      });
      showToast("Department updated"); closeModal(); load();
    } catch { showToast("Failed to update department", "error"); }
  };

  const handleDelete = async (d) => {
    try {
      await fetch(`${API}/api/departments/${d.departmentid}`, { method: "DELETE" });
      showToast(`Department "${d.name}" deleted`, "error"); load();
    } catch { showToast("Failed to delete department", "error"); }
  };

  const f = v => e => setForm(p => ({ ...p, [v]: e }));

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Departments</h2>
        <Button onClick={openCreate}>+ Add Department</Button>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead cols={["ID", "Name", "Location", "Department Head", "Actions"]} />
          <tbody>
            {depts.map(d => (
              <tr key={d.departmentid}>
                <td style={{ ...td, color: COLORS.textDim }}>{d.departmentid}</td>
                <td style={{ ...td, fontWeight: 500 }}>{d.name}</td>
                <td style={{ ...td, color: COLORS.textMuted }}>{d.location}</td>
                <td style={td}>
                  {d.managername
                    ? <Badge label={d.managername} style={{ background: COLORS.purpleDim, color: COLORS.purple }} />
                    : <span style={{ color: COLORS.textDim }}>—</span>}
                </td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(d)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(d)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "create-dept" || modal === "edit-dept") && (
        <Modal title={modal === "create-dept" ? "Add Department" : "Edit Department"} onClose={closeModal}>
          <Input label="Department Name" value={form.name} onChange={f("name")} required />
          <Input label="Location" value={form.location} onChange={f("location")} placeholder="Building A, Floor 1" />
          <Input label="Department Head" value={form.manageuserid} onChange={f("manageuserid")}
            options={users.filter(u => u.role === "Department Head").map(u => ({ value: u.userid, label: u.name }))} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button onClick={modal === "create-dept" ? handleCreate : handleUpdate} style={{ flex: 1 }}>
              {modal === "create-dept" ? "Create" : "Save"}
            </Button>
            <Button variant="ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SuppliersPage({ showToast, modal, setModal, closeModal }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editSupp, setEditSupp] = useState(null);

  const load = () => {
    fetch(`${API}/api/suppliers`).then(r => r.json())
      .then(s => { setSuppliers(s); setLoading(false); })
      .catch(() => showToast("Failed to load suppliers", "error"));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: "", contactname: "", phone: "", email: "", address: "" }); setModal("create-supp"); };
  const openEdit = (s) => { setEditSupp(s); setForm({ ...s }); setModal("edit-supp"); };

  const handleCreate = async () => {
    if (!form.name) return showToast("Supplier name required", "error");
    try {
      await fetch(`${API}/api/suppliers`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast(`Supplier "${form.name}" added`); closeModal(); load();
    } catch { showToast("Failed to create supplier", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/api/suppliers/${editSupp.supplierid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("Supplier updated"); closeModal(); load();
    } catch { showToast("Failed to update supplier", "error"); }
  };

  const handleDelete = async (s) => {
    try {
      await fetch(`${API}/api/suppliers/${s.supplierid}`, { method: "DELETE" });
      showToast(`Supplier "${s.name}" deleted`, "error"); load();
    } catch { showToast("Failed to delete supplier", "error"); }
  };

  const f = v => e => setForm(p => ({ ...p, [v]: e }));

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Suppliers</h2>
        <Button onClick={openCreate}>+ Add Supplier</Button>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead cols={["ID", "Name", "Contact", "Phone", "Email", "Actions"]} />
          <tbody>
            {suppliers.map(s => (
              <tr key={s.supplierid}>
                <td style={{ ...td, color: COLORS.textDim }}>{s.supplierid}</td>
                <td style={{ ...td, fontWeight: 500 }}>{s.name}</td>
                <td style={{ ...td, color: COLORS.textMuted }}>{s.contactname}</td>
                <td style={{ ...td, color: COLORS.textMuted }}>{s.phone}</td>
                <td style={{ ...td, color: COLORS.teal, fontSize: 12 }}>{s.email}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(s)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "create-supp" || modal === "edit-supp") && (
        <Modal title={modal === "create-supp" ? "Add Supplier" : "Edit Supplier"} onClose={closeModal}>
          <Input label="Supplier Name" value={form.name} onChange={f("name")} required />
          <Input label="Contact Name" value={form.contactname} onChange={f("contactname")} />
          <Input label="Phone" value={form.phone} onChange={f("phone")} />
          <Input label="Email" type="email" value={form.email} onChange={f("email")} />
          <Input label="Address" value={form.address} onChange={f("address")} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button onClick={modal === "create-supp" ? handleCreate : handleUpdate} style={{ flex: 1 }}>
              {modal === "create-supp" ? "Add Supplier" : "Save"}
            </Button>
            <Button variant="ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TransactionsPage({ showToast, modal, setModal, closeModal }) {
  const [transactions, setTransactions] = useState([]);
  const [items, setItems] = useState([]);
  const [depts, setDepts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  const load = () => {
    Promise.all([
      fetch(`${API}/api/transactions`).then(r => r.json()),
      fetch(`${API}/api/items`).then(r => r.json()),
      fetch(`${API}/api/departments`).then(r => r.json()),
      fetch(`${API}/api/users`).then(r => r.json()),
    ]).then(([t, i, d, u]) => { setTransactions(t); setItems(i); setDepts(d); setUsers(u); setLoading(false); })
      .catch(() => showToast("Failed to load transactions", "error"));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ itemid: "", departmentid: "", userid: "", transactiontype: "Addition", quantity: 1 });
    setModal("create-tx");
  };

  const handleCreate = async () => {
    if (!form.itemid || !form.departmentid) return showToast("Item and department required", "error");
    try {
      await fetch(`${API}/api/transactions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, itemid: Number(form.itemid), departmentid: Number(form.departmentid), userid: Number(form.userid), quantity: Number(form.quantity) }),
      });
      showToast("Transaction recorded"); closeModal(); load();
    } catch { showToast("Failed to record transaction", "error"); }
  };

  const handleDelete = async (tx) => {
    try {
      await fetch(`${API}/api/transactions/${tx.transactionid}`, { method: "DELETE" });
      showToast(`Transaction #${tx.transactionid} deleted`, "error"); load();
    } catch { showToast("Failed to delete transaction", "error"); }
  };

  const f = v => e => setForm(p => ({ ...p, [v]: e }));

  if (loading) return <div style={{ color: COLORS.textMuted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Stock Transactions</h2>
        <Button onClick={openCreate}>+ Log Transaction</Button>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead cols={["ID", "Item", "Department", "Logged By", "Type", "Quantity", "Date", "Actions"]} />
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.transactionid}>
                <td style={{ ...td, color: COLORS.textDim }}>{tx.transactionid}</td>
                <td style={{ ...td, fontWeight: 500, fontSize: 12 }}>{tx.itemname}</td>
                <td style={{ ...td, color: COLORS.textMuted }}>{tx.departmentname}</td>
                <td style={{ ...td, color: COLORS.textMuted, fontSize: 12 }}>{tx.username}</td>
                <td style={td}><Badge label={tx.transactiontype} style={TX_COLOR[tx.transactiontype] || {}} /></td>
                <td style={{ ...td, fontWeight: 600 }}>{tx.quantity}</td>
                <td style={{ ...td, color: COLORS.textDim, fontSize: 11 }}>{tx.transactiondate?.slice(0, 16)}</td>
                <td style={td}>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(tx)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "create-tx" && (
        <Modal title="Log Stock Transaction" onClose={closeModal}>
          <Input label="Item" value={form.itemid} onChange={f("itemid")} required
            options={items.map(i => ({ value: i.itemid, label: i.name }))} />
          <Input label="Department" value={form.departmentid} onChange={f("departmentid")} required
            options={depts.map(d => ({ value: d.departmentid, label: d.name }))} />
          <Input label="Logged By" value={form.userid} onChange={f("userid")}
            options={users.map(u => ({ value: u.userid, label: u.name }))} />
          <Input label="Transaction Type" value={form.transactiontype} onChange={f("transactiontype")}
            options={["Addition", "Usage", "Transfer"].map(t => ({ value: t, label: t }))} />
          <Input label="Quantity" type="number" value={form.quantity} onChange={f("quantity")} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button onClick={handleCreate} style={{ flex: 1 }}>Record Transaction</Button>
            <Button variant="ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}