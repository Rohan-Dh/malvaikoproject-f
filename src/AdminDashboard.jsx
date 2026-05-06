import { useState, useEffect, useCallback, useRef } from "react";
import { logout as apiLogout, authFetch, getBase } from "./api";
import "./AdminDashboard.css";

const PAGE_SIZE = 20;

function useOrders(token) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const r = await authFetch(`${getBase()}/api/orders/get`);
      const d = await r.json();
      if (!d.ok) throw new Error(d.message);
      setOrders(d.orders || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { orders, loading, error, reload: load };
}

function useClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-US",{hour12:false}));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US",{hour12:false})), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`db-toast db-toast--${type}`}>{msg}</div>;
}

function StatCard({ label, value, sub, delay }) {
  return (
    <div className="db-stat" style={{ animationDelay: `${delay}s` }}>
      <div className="db-stat__label">{label}</div>
      <div className="db-stat__value">{value ?? "—"}</div>
      {sub && <div className="db-stat__sub">{sub}</div>}
    </div>
  );
}

function computeStats(orders) {
  const total = orders.length;
  const today = new Date().toDateString();
  const todayCount = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;

  const svcMap = {}, devMap = {};
  orders.forEach(o => {
    if (o.service) svcMap[o.service] = (svcMap[o.service]||0)+1;
    if (o.device)  devMap[o.device]  = (devMap[o.device] ||0)+1;
  });
  const topSvc = Object.entries(svcMap).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "—";
  const topDev = Object.entries(devMap).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "—";

  return { total, todayCount, topSvc, topDev };
}

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"});
}

function esc(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

export default function AdminDashboard({ onLogout }) {
  const { orders, loading, error, reload } = useOrders();
  const clock = useClock();

  const [query,   setQuery]   = useState("");
  const [sortCol, setSortCol] = useState("createdAt");
  const [sortDir, setSortDir] = useState(-1);
  const [page,    setPage]    = useState(1);
  const [toast,   setToast]   = useState({ msg:"", type:"success" });
  const [tooltipOrder, setTooltipOrder] = useState(null);
  const tooltipRef = useRef(null);

  function showToast(msg, type="success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"success" }), 3000);
  }

  useEffect(() => {
    if (!loading && !error) showToast(`${orders.length} orders loaded`);
    if (error) showToast(error, "error");
  }, [loading]);

  // close tooltip on outside click
  useEffect(() => {
    function handler(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) setTooltipOrder(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const stats = computeStats(orders);

  // filter
  const q = query.toLowerCase();
  const filtered = q
    ? orders.filter(o =>
        ["name","email","phone","service","device","message"].some(k =>
          (o[k]||"").toLowerCase().includes(q)
        )
      )
    : orders;

  // sort
  const sorted = [...filtered].sort((a,b) => {
    let av = a[sortCol]??'', bv = b[sortCol]??'';
    if (sortCol==="createdAt") { av=new Date(av); bv=new Date(bv); }
    return av<bv ? -sortDir : av>bv ? sortDir : 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const slice      = sorted.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);

  function handleSort(col) {
    setSortDir(prev => sortCol===col ? prev*-1 : -1);
    setSortCol(col);
    setPage(1);
  }

  async function handleLogout() {
    await apiLogout();
    onLogout();
  }

  async function handleDownload() {
    try {
      const r = await authFetch(`${getBase()}/api/orders/download`);
      if (!r.ok) { showToast("Download failed.", "error"); return; }
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "orders.xlsx"; a.click();
      URL.revokeObjectURL(url);
      showToast("Downloaded orders.xlsx");
    } catch(e) { showToast(e.message, "error"); }
  }

  const COLS = [
    { key:"orderId",   label:"ID"      },
    { key:"createdAt", label:"Date"    },
    { key:"name",      label:"Name"    },
    { key:"phone",     label:"Phone"   },
    { key:"email",     label:"Email"   },
    { key:"device",    label:"Device"  },
    { key:"service",   label:"Service" },
    { key:"message",   label:"Message" },
    { key:"ip",        label:"IP"      },
  ];

  return (
    <div className="db-root">
      <div className="db-noise" />

      {/* ── TOPBAR ── */}
      <header className="db-topbar">
        <div className="db-topbar__brand">
          WhroBroKit <span>Dashboard</span>
        </div>
        <div className="db-topbar__right">
          <span className="db-clock">{clock}</span>
          <button className="db-btn-logout" onClick={handleLogout}>↩ Logout</button>
        </div>
      </header>

      <main className="db-main">

        {/* ── STATS ── */}
        <div className="db-stats">
          <StatCard label="Total Orders" value={stats.total}      sub="all time"   delay={0.05} />
          <StatCard label="Today"        value={stats.todayCount} sub="new orders" delay={0.10} />
          <StatCard label="Top Service"  value={stats.topSvc}     sub="most ordered" delay={0.15} />
          <StatCard label="Top Device"   value={stats.topDev}     sub="most used"  delay={0.20} />
        </div>

        {/* ── TOOLBAR ── */}
        <div className="db-toolbar">
          <div className="db-toolbar__left">
            <span className="db-section-title">Orders</span>
            <span className="db-badge">{filtered.length}</span>
            <div className="db-search-wrap">
              <span className="db-search-icon">⌕</span>
              <input
                className="db-search"
                placeholder="Search name, email, service…"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <div className="db-toolbar__right">
            <button className="db-btn-secondary" onClick={reload}>↺ Refresh</button>
            <button className="db-btn-primary"   onClick={handleDownload}>↓ Export XLSX</button>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="db-table-wrap">
          <div className="db-table-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  {COLS.map(c => (
                    <th
                      key={c.key}
                      className={sortCol===c.key ? "sorted" : ""}
                      onClick={() => handleSort(c.key)}
                    >
                      {c.label}
                      <span className="sort-arrow">
                        {sortCol===c.key ? (sortDir===-1 ? " ↓" : " ↑") : " ↕"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={9}>
                    <div className="db-state">
                      <div className="db-spinner" />
                      <p>Loading orders…</p>
                    </div>
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={9}>
                    <div className="db-state">
                      <div className="db-state__icon">⚠</div>
                      <p>{error}</p>
                    </div>
                  </td></tr>
                )}
                {!loading && !error && slice.length === 0 && (
                  <tr><td colSpan={9}>
                    <div className="db-state">
                      <div className="db-state__icon">◌</div>
                      <p>No orders found.</p>
                    </div>
                  </td></tr>
                )}
                {!loading && slice.map((o, i) => (
                  <tr key={o.orderId} style={{ animationDelay: `${i*0.025}s` }}>
                    <td className="td-id" title={o.orderId}>{(o.orderId||"").slice(0,8)}…</td>
                    <td className="td-date">{fmtDate(o.createdAt)}</td>
                    <td className="td-name">{o.name||"—"}</td>
                    <td className="td-phone">{o.phone||"—"}</td>
                    <td className="td-email">{o.email||"—"}</td>
                    <td className="td-device">{o.device||"—"}</td>
                    <td>
                      <span className={`td-service${o.service?"":" empty"}`}>
                        {o.service||"—"}
                      </span>
                    </td>
                    <td
                      className="td-msg-cell"
                      onClick={() => setTooltipOrder(tooltipOrder?.orderId===o.orderId ? null : o)}
                    >
                      <span className="td-message">
                        {(o.message||"").length > 40
                          ? (o.message||"").slice(0,40)+"…"
                          : (o.message||"—")}
                      </span>
                      {tooltipOrder?.orderId === o.orderId && (
                        <div className="db-msg-tooltip" ref={tooltipRef}>
                          {o.message}
                        </div>
                      )}
                    </td>
                    <td className="td-ip">{o.ip||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <div className="db-pagination">
            <span className="db-page-info">
              {sorted.length === 0 ? "—"
                : `${(safePage-1)*PAGE_SIZE+1}–${Math.min(safePage*PAGE_SIZE, sorted.length)} of ${sorted.length}`}
            </span>
            <div className="db-page-btns">
              <button disabled={safePage===1}          onClick={() => setPage(p=>p-1)}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1)
                .filter(p => totalPages<=7 || Math.abs(p-safePage)<=1 || p===1 || p===totalPages)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && arr[i-1] !== p-1) acc.push("…");
                  acc.push(p); return acc;
                }, [])
                .map((p,i) => typeof p==="string"
                  ? <span key={`e${i}`} className="db-ellipsis">…</span>
                  : <button key={p} className={p===safePage?"active":""} onClick={()=>setPage(p)}>{p}</button>
                )}
              <button disabled={safePage===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
            </div>
          </div>
        </div>

      </main>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}