import { useState, useEffect, useCallback } from "react";

// ─── THEME & GLOBALS ────────────────────────────────────────────────────────
const theme = {
  bg: "#0A0A0F",
  surface: "#13131A",
  card: "#1C1C27",
  border: "#2A2A3A",
  accent: "#4F8EF7",
  accentSoft: "#1E3560",
  success: "#2DD4A0",
  warning: "#F7A94F",
  danger: "#F75F5F",
  textPrimary: "#F0F0F8",
  textSecondary: "#8888A8",
  textMuted: "#555570",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${theme.bg}; color: ${theme.textPrimary}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }

  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; position: relative; }
  
  /* NAV */
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px;
    background: ${theme.surface}; border-top: 1px solid ${theme.border}; display: flex; z-index: 100;
    padding: 8px 0 20px; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px;
    cursor: pointer; transition: all .2s; border: none; background: none; color: ${theme.textMuted}; }
  .nav-item.active { color: ${theme.accent}; }
  .nav-item svg { width: 22px; height: 22px; }
  .nav-label { font-size: 10px; font-weight: 500; letter-spacing: .3px; }

  /* HEADER */
  .header { padding: 56px 20px 16px; display: flex; align-items: center; justify-content: space-between; }
  .header-title { font-size: 22px; font-weight: 700; letter-spacing: -.5px; }
  .header-sub { font-size: 13px; color: ${theme.textSecondary}; margin-top: 2px; }
  .header-badge { background: ${theme.accentSoft}; color: ${theme.accent}; font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 20px; }

  /* CONTENT */
  .content { flex: 1; padding: 0 16px 120px; overflow-y: auto; }

  /* CARDS */
  .card { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 16px; margin-bottom: 12px; }
  .card-sm { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 12px 14px; }

  /* METRIC GRID */
  .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .metric-card { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 14px; transition: border-color .15s; }
  .metric-card[style*="cursor: pointer"]:active { border-color: ${theme.accent}; }
  .metric-label { font-size: 11px; color: ${theme.textSecondary}; font-weight: 500; letter-spacing: .3px; text-transform: uppercase; margin-bottom: 6px; }
  .metric-value { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 500; color: ${theme.textPrimary}; line-height: 1; }
  .metric-value.accent { color: ${theme.accent}; }
  .metric-value.success { color: ${theme.success}; }
  .metric-value.warning { color: ${theme.warning}; }
  .metric-value.danger { color: ${theme.danger}; }
  .metric-sub { font-size: 11px; color: ${theme.textMuted}; margin-top: 4px; }

  /* PROGRESS BAR */
  .progress-wrap { margin: 6px 0 2px; }
  .progress-track { background: ${theme.border}; border-radius: 4px; height: 6px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width .5s ease; }

  /* SECTION TITLE */
  .section-title { font-size: 13px; font-weight: 600; color: ${theme.textSecondary}; text-transform: uppercase;
    letter-spacing: .8px; margin: 20px 0 10px; }

  /* LIST ITEMS */
  .list-item { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 12px;
    padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
  .list-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; font-size: 16px; }
  .list-main { flex: 1; min-width: 0; }
  .list-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .list-sub { font-size: 12px; color: ${theme.textSecondary}; margin-top: 2px; }
  .list-right { text-align: right; flex-shrink: 0; }
  .list-value { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; }
  .list-value-sub { font-size: 11px; color: ${theme.textMuted}; margin-top: 2px; }

  /* ALERT ITEMS */
  .alert-item { border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
  .alert-ok { background: rgba(45,212,160,.08); border: 1px solid rgba(45,212,160,.2); }
  .alert-warn { background: rgba(247,169,79,.08); border: 1px solid rgba(247,169,79,.25); }
  .alert-danger { background: rgba(247,95,95,.08); border: 1px solid rgba(247,95,95,.25); }

  /* FAB */
  .fab { position: fixed; bottom: 88px; right: calc(50% - 215px + 16px); width: 52px; height: 52px;
    background: ${theme.accent}; border-radius: 16px; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(79,142,247,.4);
    transition: transform .15s, box-shadow .15s; z-index: 99; }
  .fab:active { transform: scale(.93); box-shadow: 0 2px 10px rgba(79,142,247,.3); }
  .fab svg { width: 22px; height: 22px; color: #fff; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 200; display: flex;
    align-items: flex-end; justify-content: center; animation: fadeIn .15s; }
  .modal { background: ${theme.surface}; border-radius: 24px 24px 0 0; width: 100%; max-width: 430px;
    padding: 24px 20px 40px; border-top: 1px solid ${theme.border}; animation: slideUp .2s ease; max-height: 90vh; overflow-y: auto; }
  .modal-handle { width: 36px; height: 4px; background: ${theme.border}; border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

  /* FORM */
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 12px; font-weight: 600; color: ${theme.textSecondary}; text-transform: uppercase;
    letter-spacing: .5px; margin-bottom: 6px; display: block; }
  .form-input { width: 100%; background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 12px;
    padding: 12px 14px; color: ${theme.textPrimary}; font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: border-color .2s; -webkit-appearance: none; }
  .form-input:focus { border-color: ${theme.accent}; }
  .form-input::placeholder { color: ${theme.textMuted}; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .form-select { width: 100%; background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 12px;
    padding: 12px 14px; color: ${theme.textPrimary}; font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; -webkit-appearance: none; cursor: pointer; }

  /* BUTTONS */
  .btn { width: 100%; padding: 14px; border-radius: 14px; border: none; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all .15s; }
  .btn-primary { background: ${theme.accent}; color: #fff; }
  .btn-primary:active { transform: scale(.98); }
  .btn-ghost { background: ${theme.card}; color: ${theme.textSecondary}; border: 1px solid ${theme.border}; margin-top: 8px; }
  .btn-danger { background: rgba(247,95,95,.15); color: ${theme.danger}; border: 1px solid rgba(247,95,95,.3); margin-top: 8px; }

  /* CHIPS */
  .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer;
    border: 1px solid ${theme.border}; background: ${theme.card}; color: ${theme.textSecondary}; transition: all .15s; }
  .chip.active { background: ${theme.accentSoft}; border-color: ${theme.accent}; color: ${theme.accent}; }

  /* VEHICLE SELECTOR */
  .vehicle-pill { display: flex; align-items: center; gap: 8px; background: ${theme.card};
    border: 1px solid ${theme.border}; border-radius: 20px; padding: 6px 12px 6px 8px; cursor: pointer; }
  .vehicle-dot { width: 8px; height: 8px; border-radius: 50%; background: ${theme.accent}; }
  .vehicle-name { font-size: 13px; font-weight: 500; }

  /* EMPTY STATE */
  .empty { text-align: center; padding: 40px 20px; color: ${theme.textMuted}; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; line-height: 1.5; }

  /* MONTH SELECTOR */
  .month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .month-label { font-size: 15px; font-weight: 600; }
  .month-btn { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 8px;
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: ${theme.textSecondary}; }

  /* SETTINGS */
  .settings-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0;
    border-bottom: 1px solid ${theme.border}; }
  .settings-label { font-size: 14px; font-weight: 500; }
  .settings-sub { font-size: 12px; color: ${theme.textSecondary}; margin-top: 2px; }
  .settings-action { font-size: 13px; color: ${theme.accent}; font-weight: 500; cursor: pointer; }

  /* SWIPE DELETE */
  .swipeable { position: relative; overflow: hidden; border-radius: 12px; margin-bottom: 8px; }
  .swipe-bg { position: absolute; right: 0; top: 0; bottom: 0; background: rgba(247,95,95,.15);
    display: flex; align-items: center; padding: 0 16px; color: ${theme.danger}; font-size: 12px; font-weight: 600; }

  /* TABS */
  .tab-row { display: flex; background: ${theme.card}; border-radius: 12px; padding: 4px; margin-bottom: 16px; border: 1px solid ${theme.border}; }
  .tab { flex: 1; padding: 8px; text-align: center; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; color: ${theme.textSecondary}; transition: all .2s; }
  .tab.active { background: ${theme.accentSoft}; color: ${theme.accent}; }
`;

// ─── LOCAL STORAGE HELPERS ───────────────────────────────────────────────────
const useStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = useCallback((v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    localStorage.setItem(key, JSON.stringify(next));
  }, [key, val]);
  return [val, set];
};

// ─── UTILS ──────────────────────────────────────────────────────────────────
const fmt = {
  km: (v) => `${Math.round(Number(v || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} km`,
  kmNum: (v) => Math.round(Number(v || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
  brl: (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  date: (d) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
  monthKey: (d) => d.slice(0, 7),
  monthLabel: (k) => { const [y, m] = k.split("-"); const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]; return `${months[+m - 1]} ${y}`; },
  today: () => new Date().toISOString().slice(0, 10),
  nowMonth: () => new Date().toISOString().slice(0, 7),
};

const uid = () => Math.random().toString(36).slice(2, 10);

// ─── CURRENCY INPUT ─────────────────────────────────────────────────────────
const CurrencyInput = ({ value, onChange, placeholder = "R$ 0,00", className = "form-input", style = {} }) => {
  const format = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const num = parseInt(digits, 10) / 100;
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleChange = (e) => {
    const formatted = format(e.target.value);
    const numeric = formatted ? parseFloat(formatted.replace(/\./g, "").replace(",", ".")) : "";
    onChange(numeric, formatted);
  };

  const display = value !== "" && value !== undefined && value !== null
    ? Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";

  return (
    <input
      className={className}
      style={style}
      inputMode="numeric"
      placeholder={placeholder}
      value={display}
      onChange={handleChange}
    />
  );
};

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    route: <><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M12 7v10M8 9l4-2 4 2M8 15l4 2 4-2" strokeLinecap="round"/></>,
    fuel: <><path d="M4 22V6a2 2 0 012-2h8a2 2 0 012 2v4l2 2v6a2 2 0 01-2 2" strokeLinecap="round"/><path d="M4 12h12M9 6v6" strokeLinecap="round"/></>,
    wrench: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    car: <><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-2M5 17a2 2 0 104 0 2 2 0 00-4 0zM13 17a2 2 0 104 0 2 2 0 00-4 0z"/><path d="M1 9l2-4h16l2 4" strokeLinecap="round"/></>,
    chevLeft: <polyline points="15 18 9 12 15 6"/>,
    chevRight: <polyline points="9 18 15 12 9 6"/>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    wallet: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── ALERT STATUS ────────────────────────────────────────────────────────────
const getAlertStatus = (alert, currentKm) => {
  if (!alert.lastKm) return "ok";
  const next = alert.lastKm + alert.interval;
  const warnAt = next - alert.warnBefore;
  const remaining = next - currentKm;
  if (currentKm >= next) return "danger";
  if (currentKm >= warnAt) return "warn";
  return "ok";
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const Dashboard = ({ vehicles, currentVehicleId, trips, fuels, alerts, expenses, setTab, monthBalances, setMonthBalances }) => {
  const [month, setMonth] = useState(fmt.nowMonth());
  const [closeModal, setCloseModal] = useState(false);
  const [editBalance, setEditBalance] = useState("");

  const vehicle = vehicles.find(v => v.id === currentVehicleId);
  const allMonths = [...new Set([...trips, ...fuels].filter(r => r.vehicleId === currentVehicleId).map(r => fmt.monthKey(r.date)))].sort().reverse();
  if (!allMonths.includes(fmt.nowMonth())) allMonths.unshift(fmt.nowMonth());

  const monthTrips = trips.filter(t => t.vehicleId === currentVehicleId && fmt.monthKey(t.date) === month);
  const monthFuels = fuels.filter(f => f.vehicleId === currentVehicleId && fmt.monthKey(f.date) === month);
  const monthExpenses = expenses.filter(e => e.vehicleId === currentVehicleId && fmt.monthKey(e.date) === month);

  const totalKm = monthTrips.reduce((a, t) => a + (t.kmFinal - t.kmInitial), 0);
  const totalFuelCost = monthFuels.reduce((a, f) => a + +f.total, 0);
  const totalExpenses = monthExpenses.reduce((a, e) => a + +e.value, 0);

  // Último preço/litro de todos os abastecimentos do veículo até esse mês
  const allFuelsUpToMonth = fuels
    .filter(f => f.vehicleId === currentVehicleId && fmt.monthKey(f.date) <= month)
    .sort((a, b) => b.date.localeCompare(a.date));
  const lastPricePerLiter = allFuelsUpToMonth.length ? +allFuelsUpToMonth[0].pricePerLiter : 0;

  const avgKmL = vehicle?.avgKmL || 11;
  const estimatedLiters = avgKmL > 0 ? totalKm / avgKmL : 0;
  const estimatedCost = estimatedLiters * lastPricePerLiter;

  // Saldo mês anterior
  const prevMonthKey = (() => {
    const idx = allMonths.indexOf(month);
    return idx < allMonths.length - 1 ? allMonths[idx + 1] : null;
  })();
  const balKey = `${currentVehicleId}_${month}`;
  const prevBalKey = prevMonthKey ? `${currentVehicleId}_${prevMonthKey}` : null;
  const prevBalance = prevBalKey && monthBalances[prevBalKey]
    ? monthBalances[prevBalKey].balance
    : (vehicle?.initialBalance ?? 0);

  // Saldo = abastecido + saldo anterior - custo estimado
  const calculatedBalance = totalFuelCost + prevBalance - estimatedCost;
  const isCurrentMonth = month === fmt.nowMonth();
  const isClosed = monthBalances[balKey]?.confirmed;
  const confirmedBalance = isClosed ? monthBalances[balKey].balance : null;
  const displayBalance = isClosed ? confirmedBalance : calculatedBalance;
  const balanceColor = displayBalance >= 0 ? theme.success : theme.danger;

  const currentKm = vehicle?.currentKm || 0;
  const vehicleAlerts = alerts.filter(a => a.vehicleId === currentVehicleId);
  const activeAlerts = vehicleAlerts.filter(a => getAlertStatus(a, currentKm) !== "ok");

  const openClose = () => { setEditBalance(calculatedBalance.toFixed(2).replace(".", ",")); setCloseModal(true); };

  const confirmClose = () => {
    const val = parseFloat(editBalance.replace(",", "."));
    setMonthBalances(prev => ({ ...prev, [balKey]: { confirmed: true, balance: isNaN(val) ? calculatedBalance : val } }));
    setCloseModal(false);
  };

  const reopen = () => {
    setMonthBalances(prev => { const n = { ...prev }; delete n[balKey]; return n; });
  };

  return (
    <div>
      <div className="header">
        <div>
          <div className="header-title">AutoTrack</div>
          <div className="header-sub">{vehicle ? vehicle.name : "Nenhum veículo"}</div>
        </div>
        {activeAlerts.length > 0 && (
          <div className="header-badge">⚠️ {activeAlerts.length} alerta{activeAlerts.length > 1 ? "s" : ""}</div>
        )}
      </div>

      <div className="content">
        {/* Alertas */}
        {activeAlerts.length > 0 && (
          <>
            <div className="section-title">Manutenção</div>
            {activeAlerts.map(a => {
              const status = getAlertStatus(a, currentKm);
              const remaining = (a.lastKm + a.interval) - currentKm;
              return (
                <div key={a.id} className={`alert-item alert-${status}`}>
                  <span style={{ fontSize: 20 }}>{status === "danger" ? "🔴" : "⚠️"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                      {status === "danger" ? `Vencida há ${fmt.km(Math.abs(remaining))}` : `Faltam ${fmt.km(remaining)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Navegação mês */}
        <div className="month-nav">
          <button className="month-btn" onClick={() => { const i = allMonths.indexOf(month); if (i < allMonths.length - 1) setMonth(allMonths[i + 1]); }}><Icon name="chevLeft" size={16}/></button>
          <span className="month-label">{fmt.monthLabel(month)} {isClosed ? "✓" : ""}</span>
          <button className="month-btn" onClick={() => { const i = allMonths.indexOf(month); if (i > 0) setMonth(allMonths[i - 1]); }}><Icon name="chevRight" size={16}/></button>
        </div>

        {/* KM */}
        <div className="metric-grid">
          <div className="metric-card" onClick={() => setTab("trips")} style={{ cursor: "pointer" }}>
            <div className="metric-label">KM no mês</div>
            <div className="metric-value accent">{fmt.kmNum(totalKm)}</div>
            <div className="metric-sub">{monthTrips.length} percurso{monthTrips.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="metric-card" onClick={() => setTab("settings")} style={{ cursor: "pointer" }}>
            <div className="metric-label">KM atual</div>
            <div className="metric-value">{fmt.kmNum(currentKm)}</div>
            <div className="metric-sub">hodômetro</div>
          </div>
        </div>

        {/* Painel de saldo — principal */}
        <div className="card" onClick={() => setTab("fuels")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="metric-label" style={{ marginBottom: 0 }}>Combustível</div>
            {lastPricePerLiter > 0 && (
              <div style={{ fontSize: 11, color: theme.textMuted }}>R$ {lastPricePerLiter.toFixed(3).replace(".", ",")} /L · {avgKmL} km/L</div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>Litros estimados</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500 }}>{estimatedLiters.toFixed(2).replace(".", ",")} L</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>Custo estimado</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500 }}>{fmt.brl(estimatedCost)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>Abastecido</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: theme.warning }}>{fmt.brl(totalFuelCost)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>Saldo anterior</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: prevBalance >= 0 ? theme.success : theme.danger }}>{fmt.brl(prevBalance)}</div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 2 }}>{isClosed ? "Saldo confirmado" : "Saldo do mês"}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: balanceColor }}>
                {displayBalance >= 0 ? "+" : ""}{fmt.brl(displayBalance)}
              </div>
            </div>
            <div style={{ fontSize: 20 }}>{displayBalance >= 0 ? "✅" : "🔴"}</div>
          </div>
        </div>

        {/* Botão fechar/reabrir mês */}
        {!isCurrentMonth && !isClosed && (
          <button className="btn btn-ghost" style={{ marginBottom: 12 }} onClick={e => { e.stopPropagation(); openClose(); }}>
            Fechar mês de {fmt.monthLabel(month)}
          </button>
        )}
        {isCurrentMonth && !isClosed && (
          <button className="btn btn-ghost" style={{ marginBottom: 12 }} onClick={e => { e.stopPropagation(); openClose(); }}>
            Fechar {fmt.monthLabel(month)} antecipado
          </button>
        )}
        {isClosed && (
          <button className="btn btn-ghost" style={{ marginBottom: 12, color: theme.textMuted }} onClick={reopen}>
            Reabrir mês
          </button>
        )}

        {/* Despesas */}
        {totalExpenses > 0 && (
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Despesas</div>
              <div className="metric-value warning">{fmt.brl(totalExpenses)}</div>
              <div className="metric-sub">{monthExpenses.length} lançamento{monthExpenses.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total geral</div>
              <div className="metric-value danger">{fmt.brl(totalFuelCost + totalExpenses)}</div>
              <div className="metric-sub">combustível + despesas</div>
            </div>
          </div>
        )}

        {/* Últimos percursos */}
        {monthTrips.length > 0 && (
          <>
            <div className="section-title">Últimos percursos</div>
            {monthTrips.slice(-3).reverse().map(t => (
              <div key={t.id} className="list-item">
                <div className="list-icon" style={{ background: theme.accentSoft }}><Icon name="route" size={16}/></div>
                <div className="list-main">
                  <div className="list-title">{t.destination || "Percurso"}</div>
                  <div className="list-sub">{fmt.date(t.date)}</div>
                </div>
                <div className="list-right">
                  <div className="list-value" style={{ color: theme.accent }}>{fmt.km(t.kmFinal - t.kmInitial)}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal fechar mês */}
      {closeModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setCloseModal(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">Fechar {fmt.monthLabel(month)}</div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["KM rodados", `${fmt.kmNum(totalKm)} km`],
                  ["Litros estimados", `${estimatedLiters.toFixed(2).replace(".", ",")} L`],
                  ["Custo estimado", fmt.brl(estimatedCost)],
                  ["Abastecido", fmt.brl(totalFuelCost)],
                  ["Saldo anterior", fmt.brl(prevBalance)],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: theme.textSecondary }}>{label}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Saldo a carregar para o próximo mês</label>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>Calculado: {calculatedBalance >= 0 ? "+" : ""}{fmt.brl(calculatedBalance)} — ajuste se precisar</div>
              <input
                className="form-input"
                inputMode="decimal"
                value={editBalance}
                onChange={e => setEditBalance(e.target.value)}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 18 }}
              />
            </div>

            <button className="btn btn-primary" onClick={confirmClose}>Confirmar e fechar mês</button>
            <button className="btn btn-ghost" onClick={() => setCloseModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PERCURSOS ───────────────────────────────────────────────────────────────
const Trips = ({ trips, setTrips, vehicles, currentVehicleId }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: fmt.today(), kmInitial: "", kmFinal: "", destination: "" });
  const [month, setMonth] = useState(fmt.nowMonth());

  const vehicle = vehicles.find(v => v.id === currentVehicleId);
  const months = [...new Set(trips.filter(t => t.vehicleId === currentVehicleId).map(t => fmt.monthKey(t.date)))].sort().reverse();
  const allMonths = months.length ? months : [fmt.nowMonth()];

  const monthTrips = trips.filter(t => t.vehicleId === currentVehicleId && fmt.monthKey(t.date) === month).sort((a, b) => b.date.localeCompare(a.date));
  const totalKm = monthTrips.reduce((a, t) => a + (t.kmFinal - t.kmInitial), 0);

  const save = () => {
    if (!form.kmInitial || !form.kmFinal || +form.kmFinal <= +form.kmInitial) return;
    setTrips(prev => [...prev, { ...form, id: uid(), vehicleId: currentVehicleId, kmInitial: +form.kmInitial, kmFinal: +form.kmFinal }]);
    setModal(false);
    setForm({ date: fmt.today(), kmInitial: "", kmFinal: "", destination: "" });
  };

  const remove = (id) => setTrips(prev => prev.filter(t => t.id !== id));

  return (
    <div>
      <div className="header">
        <div>
          <div className="header-title">Percursos</div>
          <div className="header-sub">{vehicle?.name}</div>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: theme.accent }}>{fmt.km(totalKm)}</div>
      </div>

      <div className="content">
        <div className="month-nav">
          <button className="month-btn" onClick={() => { const i = allMonths.indexOf(month); if (i < allMonths.length - 1) setMonth(allMonths[i + 1]); }}><Icon name="chevLeft" size={16}/></button>
          <span className="month-label">{fmt.monthLabel(month)}</span>
          <button className="month-btn" onClick={() => { const i = allMonths.indexOf(month); if (i > 0) setMonth(allMonths[i - 1]); }}><Icon name="chevRight" size={16}/></button>
        </div>

        {monthTrips.length === 0 ? (
          <div className="empty"><div className="empty-icon">🗺️</div><div className="empty-text">Nenhum percurso em {fmt.monthLabel(month)}.<br/>Toque no + para adicionar.</div></div>
        ) : monthTrips.map(t => (
          <div key={t.id} className="list-item">
            <div className="list-icon" style={{ background: theme.accentSoft }}><Icon name="route" size={16}/></div>
            <div className="list-main">
              <div className="list-title">{t.destination || "Percurso"}</div>
              <div className="list-sub">{fmt.date(t.date)} · {fmt.kmNum(t.kmInitial)} → {fmt.kmNum(t.kmFinal)}</div>
            </div>
            <div className="list-right">
              <div className="list-value" style={{ color: theme.accent }}>{fmt.km(t.kmFinal - t.kmInitial)}</div>
              <div style={{ marginTop: 4, cursor: "pointer", color: theme.danger }} onClick={() => remove(t.id)}><Icon name="trash" size={14}/></div>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => setModal(true)}><Icon name="plus"/></button>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">Novo percurso</div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}/>
            </div>
            <div className="form-group">
              <label className="form-label">Destino</label>
              <input className="form-input" placeholder="Ex: Trabalho, Shopping..." value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">KM inicial</label>
                <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={form.kmInitial} onChange={e => setForm(p => ({ ...p, kmInitial: e.target.value.replace(/\D/g, "") }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">KM final</label>
                <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={form.kmFinal} onChange={e => setForm(p => ({ ...p, kmFinal: e.target.value.replace(/\D/g, "") }))}/>
              </div>
            </div>
            {form.kmInitial && form.kmFinal && +form.kmFinal > +form.kmInitial && (
              <div className="card-sm" style={{ marginBottom: 14, background: theme.accentSoft, border: `1px solid ${theme.accent}` }}>
                <span style={{ color: theme.accent, fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600 }}>
                  {fmt.km(+form.kmFinal - +form.kmInitial)}
                </span>
                <span style={{ color: theme.textSecondary, fontSize: 13, marginLeft: 8 }}>neste percurso</span>
              </div>
            )}
            <button className="btn btn-primary" onClick={save}>Salvar percurso</button>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── COMBUSTÍVEL ─────────────────────────────────────────────────────────────
const Fuels = ({ fuels, setFuels, vehicles, currentVehicleId }) => {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ date: fmt.today(), pricePerLiter: "", total: "" });
  const [month, setMonth] = useState(fmt.nowMonth());

  const vehicle = vehicles.find(v => v.id === currentVehicleId);
  const months = [...new Set(fuels.filter(f => f.vehicleId === currentVehicleId).map(f => fmt.monthKey(f.date)))].sort().reverse();
  const allMonths = months.length ? months : [fmt.nowMonth()];

  const monthFuels = fuels.filter(f => f.vehicleId === currentVehicleId && fmt.monthKey(f.date) === month).sort((a, b) => b.date.localeCompare(a.date));
  const totalCost = monthFuels.reduce((a, f) => a + +f.total, 0);
  const totalLiters = monthFuels.reduce((a, f) => a + +f.liters, 0);

  const litersCalc = form.pricePerLiter && form.total ? (+form.total / +form.pricePerLiter) : null;

  const openNew = () => { setEditingId(null); setForm({ date: fmt.today(), pricePerLiter: "", total: "" }); setModal(true); };
  const openEdit = (f) => { setEditingId(f.id); setForm({ date: f.date, pricePerLiter: f.pricePerLiter, total: f.total }); setModal(true); };

  const save = () => {
    if (!form.pricePerLiter || !form.total) return;
    const liters = +form.total / +form.pricePerLiter;
    if (editingId) {
      setFuels(prev => prev.map(f => f.id === editingId ? { ...f, ...form, liters, total: +form.total, pricePerLiter: +form.pricePerLiter } : f));
    } else {
      setFuels(prev => [...prev, { ...form, id: uid(), vehicleId: currentVehicleId, liters, total: +form.total, pricePerLiter: +form.pricePerLiter }]);
    }
    setModal(false);
    setForm({ date: fmt.today(), pricePerLiter: "", total: "" });
    setEditingId(null);
  };

  const remove = (id) => setFuels(prev => prev.filter(f => f.id !== id));

  return (
    <div>
      <div className="header">
        <div>
          <div className="header-title">Combustível</div>
          <div className="header-sub">{vehicle?.name}</div>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: theme.warning }}>{fmt.brl(totalCost)}</div>
      </div>
      <div className="content">
        <div className="month-nav">
          <button className="month-btn" onClick={() => { const i = allMonths.indexOf(month); if (i < allMonths.length - 1) setMonth(allMonths[i + 1]); }}><Icon name="chevLeft" size={16}/></button>
          <span className="month-label">{fmt.monthLabel(month)}</span>
          <button className="month-btn" onClick={() => { const i = allMonths.indexOf(month); if (i > 0) setMonth(allMonths[i - 1]); }}><Icon name="chevRight" size={16}/></button>
        </div>

        {monthFuels.length > 0 && (
          <div className="metric-grid" style={{ marginBottom: 16 }}>
            <div className="metric-card">
              <div className="metric-label">Total gasto</div>
              <div className="metric-value warning">{fmt.brl(totalCost)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total litros</div>
              <div className="metric-value">{totalLiters.toFixed(2).replace(".", ",")} L</div>
            </div>
          </div>
        )}

        {monthFuels.length === 0 ? (
          <div className="empty"><div className="empty-icon">⛽</div><div className="empty-text">Nenhum abastecimento em {fmt.monthLabel(month)}.</div></div>
        ) : monthFuels.map(f => (
          <div key={f.id} className="list-item">
            <div className="list-icon" style={{ background: "rgba(247,169,79,.15)" }}>
              <span style={{ fontSize: 16 }}>⛽</span>
            </div>
            <div className="list-main" onClick={() => openEdit(f)} style={{ cursor: "pointer" }}>
              <div className="list-title">{(+f.liters).toFixed(2).replace(".", ",")} L</div>
              <div className="list-sub">{fmt.date(f.date)} · R$ {(+f.pricePerLiter).toFixed(3).replace(".", ",")}/L</div>
            </div>
            <div className="list-right">
              <div className="list-value" style={{ color: theme.warning }}>{fmt.brl(f.total)}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 4, justifyContent: "flex-end" }}>
                <span style={{ cursor: "pointer", color: theme.accent }} onClick={() => openEdit(f)}><Icon name="edit" size={14}/></span>
                <span style={{ cursor: "pointer", color: theme.danger }} onClick={() => remove(f.id)}><Icon name="trash" size={14}/></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={openNew}><Icon name="plus"/></button>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">{editingId ? "Editar abastecimento" : "Novo abastecimento"}</div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preço/litro R$</label>
                <CurrencyInput value={form.pricePerLiter} onChange={(num) => setForm(p => ({ ...p, pricePerLiter: num }))} placeholder="R$ 0,00"/>
              </div>
              <div className="form-group">
                <label className="form-label">Total R$</label>
                <CurrencyInput value={form.total} onChange={(num) => setForm(p => ({ ...p, total: num }))} placeholder="R$ 0,00"/>
              </div>
            </div>
            {litersCalc && (
              <div className="card-sm" style={{ marginBottom: 14, background: "rgba(247,169,79,.1)", border: "1px solid rgba(247,169,79,.3)" }}>
                <span style={{ color: theme.warning, fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600 }}>
                  {litersCalc.toFixed(2).replace(".", ",")} L
                </span>
                <span style={{ color: theme.textSecondary, fontSize: 13, marginLeft: 8 }}>abastecidos</span>
              </div>
            )}
            <button className="btn btn-primary" onClick={save}>{editingId ? "Salvar alterações" : "Salvar abastecimento"}</button>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MANUTENÇÃO ──────────────────────────────────────────────────────────────
const Maintenance = ({ maintenances, setMaintenances, alerts, setAlerts, vehicles, currentVehicleId }) => {
  const [tab, setTab] = useState("history");
  const [modalMaint, setModalMaint] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [formM, setFormM] = useState({ date: fmt.today(), km: "", type: "", value: "", notes: "" });
  const [formA, setFormA] = useState({ name: "", interval: "", warnBefore: "", lastKm: "" });

  const vehicle = vehicles.find(v => v.id === currentVehicleId);
  const currentKm = vehicle?.currentKm || 0;

  const vMaintenances = maintenances.filter(m => m.vehicleId === currentVehicleId).sort((a, b) => b.date.localeCompare(a.date));
  const vAlerts = alerts.filter(a => a.vehicleId === currentVehicleId);

  const saveM = () => {
    if (!formM.type || !formM.km) return;
    setMaintenances(prev => [...prev, { ...formM, id: uid(), vehicleId: currentVehicleId, km: +formM.km, value: +formM.value }]);
    setModalMaint(false);
    setFormM({ date: fmt.today(), km: "", type: "", value: "", notes: "" });
  };

  const saveA = () => {
    if (!formA.name || !formA.interval) return;
    setAlerts(prev => [...prev, { ...formA, id: uid(), vehicleId: currentVehicleId, interval: +formA.interval, warnBefore: +formA.warnBefore || 1000, lastKm: +formA.lastKm || currentKm }]);
    setModalAlert(false);
    setFormA({ name: "", interval: "", warnBefore: "", lastKm: "" });
  };

  const removeM = (id) => setMaintenances(prev => prev.filter(m => m.id !== id));
  const removeA = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const markDone = (alert) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, lastKm: currentKm } : a));
    setMaintenances(prev => [...prev, { id: uid(), vehicleId: currentVehicleId, date: fmt.today(), km: currentKm, type: alert.name, value: 0, notes: "Registrado pelo alerta" }]);
  };

  return (
    <div>
      <div className="header">
        <div>
          <div className="header-title">Manutenção</div>
          <div className="header-sub">{vehicle?.name} · {fmt.km(currentKm)}</div>
        </div>
      </div>
      <div className="content">
        <div className="tab-row">
          <div className={`tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>Histórico</div>
          <div className={`tab ${tab === "alerts" ? "active" : ""}`} onClick={() => setTab("alerts")}>Alertas</div>
        </div>

        {tab === "history" && (
          <>
            {vMaintenances.length === 0 ? (
              <div className="empty"><div className="empty-icon">🔧</div><div className="empty-text">Nenhuma manutenção registrada.</div></div>
            ) : vMaintenances.map(m => (
              <div key={m.id} className="list-item">
                <div className="list-icon" style={{ background: "rgba(45,212,160,.1)" }}><Icon name="wrench" size={16}/></div>
                <div className="list-main">
                  <div className="list-title">{m.type}</div>
                  <div className="list-sub">{fmt.date(m.date)} · {fmt.km(m.km)}</div>
                  {m.notes && <div className="list-sub" style={{ marginTop: 2 }}>{m.notes}</div>}
                </div>
                <div className="list-right">
                  {m.value > 0 && <div className="list-value" style={{ color: theme.success }}>{fmt.brl(m.value)}</div>}
                  <div style={{ marginTop: 4, cursor: "pointer", color: theme.danger }} onClick={() => removeM(m.id)}><Icon name="trash" size={14}/></div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "alerts" && (
          <>
            {vAlerts.length === 0 ? (
              <div className="empty"><div className="empty-icon">🔔</div><div className="empty-text">Nenhum alerta configurado.<br/>Configure lembretes de manutenção preventiva.</div></div>
            ) : vAlerts.map(a => {
              const status = getAlertStatus(a, currentKm);
              const next = a.lastKm + a.interval;
              const remaining = next - currentKm;
              const pct = Math.min(((currentKm - a.lastKm) / a.interval) * 100, 100);
              const barColor = status === "danger" ? theme.danger : status === "warn" ? theme.warning : theme.success;
              return (
                <div key={a.id} className={`alert-item alert-${status}`} style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(status === "warn" || status === "danger") && (
                        <button onClick={() => markDone(a)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.success, fontSize: 12, fontWeight: 600 }}>
                          ✓ Feito
                        </button>
                      )}
                      <button onClick={() => removeA(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.danger }}>
                        <Icon name="trash" size={14}/>
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                    A cada {fmt.km(a.interval)} · {status === "danger" ? `⚠️ Vencida há ${fmt.km(Math.abs(remaining))}` : `Faltam ${fmt.km(remaining)}`}
                  </div>
                  <div className="progress-track" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }}/>
                  </div>
                </div>
              );
            })}
            <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => setModalAlert(true)}>+ Novo alerta</button>
          </>
        )}
      </div>

      {tab === "history" && <button className="fab" onClick={() => setModalMaint(true)}><Icon name="plus"/></button>}

      {/* Modal manutenção */}
      {modalMaint && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalMaint(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">Nova manutenção</div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <input className="form-input" placeholder="Ex: Troca de óleo, Alinhamento..." value={formM.type} onChange={e => setFormM(p => ({ ...p, type: e.target.value }))}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Data</label>
                <input className="form-input" type="date" value={formM.date} onChange={e => setFormM(p => ({ ...p, date: e.target.value }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">KM</label>
                <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={formM.km} onChange={e => setFormM(p => ({ ...p, km: e.target.value.replace(/\D/g, "") }))}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Valor R$</label>
              <CurrencyInput value={formM.value} onChange={(num) => setFormM(p => ({ ...p, value: num }))} placeholder="R$ 0,00"/>
            </div>
            <div className="form-group">
              <label className="form-label">Observações</label>
              <input className="form-input" placeholder="Opcional..." value={formM.notes} onChange={e => setFormM(p => ({ ...p, notes: e.target.value }))}/>
            </div>
            <button className="btn btn-primary" onClick={saveM}>Salvar manutenção</button>
            <button className="btn btn-ghost" onClick={() => setModalMaint(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal alerta */}
      {modalAlert && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalAlert(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">Novo alerta</div>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input className="form-input" placeholder="Ex: Troca de óleo, Óleo da caixa..." value={formA.name} onChange={e => setFormA(p => ({ ...p, name: e.target.value }))}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Intervalo (km)</label>
                <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="10000" value={formA.interval} onChange={e => setFormA(p => ({ ...p, interval: e.target.value.replace(/\D/g, "") }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Avisar antes (km)</label>
                <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="2000" value={formA.warnBefore} onChange={e => setFormA(p => ({ ...p, warnBefore: e.target.value.replace(/\D/g, "") }))}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Feito pela última vez em (km)</label>
              <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder={currentKm || "0"} value={formA.lastKm} onChange={e => setFormA(p => ({ ...p, lastKm: e.target.value.replace(/\D/g, "") }))}/>
            </div>
            <button className="btn btn-primary" onClick={saveA}>Criar alerta</button>
            <button className="btn btn-ghost" onClick={() => setModalAlert(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DESPESAS ────────────────────────────────────────────────────────────────
const Expenses = ({ expenses, setExpenses, vehicles, currentVehicleId }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: fmt.today(), type: "seguro", value: "", notes: "" });

  const vehicle = vehicles.find(v => v.id === currentVehicleId);
  const vExpenses = expenses.filter(e => e.vehicleId === currentVehicleId).sort((a, b) => b.date.localeCompare(a.date));
  const total = vExpenses.reduce((a, e) => a + +e.value, 0);

  const types = [
    { key: "seguro", label: "Seguro", icon: "🛡️" },
    { key: "ipva", label: "IPVA", icon: "📋" },
    { key: "licenciamento", label: "Licenciamento", icon: "📄" },
    { key: "multa", label: "Multa", icon: "🚨" },
    { key: "outro", label: "Outro", icon: "💸" },
  ];

  const save = () => {
    if (!form.value) return;
    setExpenses(prev => [...prev, { ...form, id: uid(), vehicleId: currentVehicleId, value: +form.value }]);
    setModal(false);
    setForm({ date: fmt.today(), type: "seguro", value: "", notes: "" });
  };

  const remove = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <div>
      <div className="header">
        <div>
          <div className="header-title">Despesas</div>
          <div className="header-sub">{vehicle?.name}</div>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: theme.warning }}>{fmt.brl(total)}</div>
      </div>
      <div className="content">
        {vExpenses.length === 0 ? (
          <div className="empty"><div className="empty-icon">💸</div><div className="empty-text">Nenhuma despesa registrada.<br/>IPVA, seguro, multas...</div></div>
        ) : vExpenses.map(e => {
          const t = types.find(x => x.key === e.type) || types[4];
          return (
            <div key={e.id} className="list-item">
              <div className="list-icon" style={{ background: "rgba(247,169,79,.1)", fontSize: 18 }}>{t.icon}</div>
              <div className="list-main">
                <div className="list-title">{t.label}</div>
                <div className="list-sub">{fmt.date(e.date)}{e.notes ? ` · ${e.notes}` : ""}</div>
              </div>
              <div className="list-right">
                <div className="list-value" style={{ color: theme.warning }}>{fmt.brl(e.value)}</div>
                <div style={{ marginTop: 4, cursor: "pointer", color: theme.danger }} onClick={() => remove(e.id)}><Icon name="trash" size={14}/></div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="fab" onClick={() => setModal(true)}><Icon name="plus"/></button>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">Nova despesa</div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <div className="chip-row">
                {types.map(t => (
                  <div key={t.key} className={`chip ${form.type === t.key ? "active" : ""}`} onClick={() => setForm(p => ({ ...p, type: t.key }))}>
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Data</label>
                <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Valor R$</label>
                <CurrencyInput value={form.value} onChange={(num) => setForm(p => ({ ...p, value: num }))} placeholder="R$ 0,00"/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Observações</label>
              <input className="form-input" placeholder="Opcional..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}/>
            </div>
            <button className="btn btn-primary" onClick={save}>Salvar despesa</button>
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
const Settings = ({ vehicles, setVehicles, currentVehicleId, setCurrentVehicleId }) => {
  const [modalVehicle, setModalVehicle] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [form, setForm] = useState({ name: "", model: "", year: "", currentKm: "", avgKmL: "11", initialBalance: "" });

  const openNew = () => { setEditVehicle(null); setForm({ name: "", model: "", year: "", currentKm: "", avgKmL: "11", initialBalance: "" }); setModalVehicle(true); };
  const openEdit = (v) => { setEditVehicle(v); setForm({ name: v.name, model: v.model || "", year: v.year || "", currentKm: v.currentKm || "", avgKmL: v.avgKmL || "11", initialBalance: v.initialBalance ?? "" }); setModalVehicle(true); };

  const saveVehicle = () => {
    if (!form.name) return;
    const parsed = { ...form, currentKm: +form.currentKm, avgKmL: +form.avgKmL, initialBalance: form.initialBalance !== "" ? +form.initialBalance : 0 };
    if (editVehicle) {
      setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...v, ...parsed } : v));
    } else {
      const newV = { ...parsed, id: uid() };
      setVehicles(prev => [...prev, newV]);
      setCurrentVehicleId(newV.id);
    }
    setModalVehicle(false);
  };

  const removeVehicle = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    if (currentVehicleId === id) setCurrentVehicleId(vehicles.find(v => v.id !== id)?.id || null);
  };

  return (
    <div>
      <div className="header">
        <div className="header-title">Configurações</div>
      </div>
      <div className="content">
        <div className="section-title">Veículos</div>
        {vehicles.map(v => (
          <div key={v.id} className="list-item">
            <div className="list-icon" style={{ background: v.id === currentVehicleId ? theme.accentSoft : theme.border }}><Icon name="car" size={16}/></div>
            <div className="list-main" onClick={() => setCurrentVehicleId(v.id)} style={{ cursor: "pointer" }}>
              <div className="list-title">{v.name} {v.id === currentVehicleId && "✓"}</div>
              <div className="list-sub">{v.model} {v.year} · {fmt.km(v.currentKm)}</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ cursor: "pointer", color: theme.accent }} onClick={() => openEdit(v)}><Icon name="edit" size={16}/></span>
              {vehicles.length > 1 && <span style={{ cursor: "pointer", color: theme.danger }} onClick={() => removeVehicle(v.id)}><Icon name="trash" size={16}/></span>}
            </div>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={openNew}>+ Adicionar veículo</button>

        <div className="section-title" style={{ marginTop: 24 }}>Atualizar hodômetro</div>
        {vehicles.filter(v => v.id === currentVehicleId).map(v => (
          <div key={v.id} className="card">
            <div className="form-label">KM atual do veículo</div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <input
                className="form-input"
                inputMode="numeric"
                pattern="[0-9]*"
                key={v.id}
                defaultValue={v.currentKm}
                onBlur={e => setVehicles(prev => prev.map(vv => vv.id === v.id ? { ...vv, currentKm: +e.target.value.replace(/\D/g, "") } : vv))}
                style={{ flex: 1 }}
              />
              <div style={{ color: theme.textMuted, fontSize: 13, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>km atual</div>
            </div>
          </div>
        ))}
      </div>

      {modalVehicle && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalVehicle(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">{editVehicle ? "Editar veículo" : "Novo veículo"}</div>
            <div className="form-group">
              <label className="form-label">Nome / Apelido</label>
              <input className="form-input" placeholder="Ex: Meu Carro" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Modelo</label>
                <input className="form-input" placeholder="Ex: HB20" value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Ano</label>
                <input className="form-input" placeholder="2021" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">KM atual</label>
                <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={form.currentKm} onChange={e => setForm(p => ({ ...p, currentKm: e.target.value.replace(/\D/g, "") }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Média km/L</label>
                <input className="form-input" inputMode="decimal" placeholder="11" value={form.avgKmL} onChange={e => setForm(p => ({ ...p, avgKmL: e.target.value }))}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Saldo inicial de combustível R$</label>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Saldo do mês anterior ao início do controle. Negativo = deve; positivo = sobrou.</div>
              <CurrencyInput value={form.initialBalance !== "" ? Math.abs(+form.initialBalance) : ""} onChange={(num) => setForm(p => ({ ...p, initialBalance: +p.initialBalance < 0 ? -num : num }))} placeholder="R$ 0,00"/>
              <div className="chip-row" style={{ marginTop: 8 }}>
                <div className={`chip ${+form.initialBalance >= 0 ? "active" : ""}`} onClick={() => setForm(p => ({ ...p, initialBalance: Math.abs(+p.initialBalance) }))}>Positivo (sobrou)</div>
                <div className={`chip ${+form.initialBalance < 0 ? "active" : ""}`} onClick={() => setForm(p => ({ ...p, initialBalance: -Math.abs(+p.initialBalance) }))}>Negativo (deve)</div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveVehicle}>{editVehicle ? "Salvar" : "Adicionar"}</button>
            <button className="btn btn-ghost" onClick={() => setModalVehicle(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── GOOGLE SHEETS INTEGRATION ──────────────────────────────────────────────
const GAPI_CLIENT_ID = "7240714398-a59mjh72vsoj4cc9n6f839mmtm9qnbc9.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";
const SPREADSHEET_NAME = "AutoTrack Dados";

const gapi = {
  tokenClient: null,
  accessToken: null,

  async init() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => {
        gapi.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GAPI_CLIENT_ID,
          scope: SCOPES,
          callback: (resp) => {
            if (resp.access_token) {
              gapi.accessToken = resp.access_token;
              localStorage.setItem("gapi_token", resp.access_token);
            }
          },
        });
        resolve();
      };
      document.head.appendChild(script);
    });
  },

  async signIn() {
    return new Promise((resolve, reject) => {
      if (!gapi.tokenClient) { reject("not initialized"); return; }
      gapi.tokenClient.callback = (resp) => {
        if (resp.error) { reject(resp.error); return; }
        gapi.accessToken = resp.access_token;
        localStorage.setItem("gapi_token", resp.access_token);
        resolve(resp.access_token);
      };
      gapi.tokenClient.requestAccessToken({ prompt: "consent" });
    });
  },

  async request(method, url, body) {
    const token = gapi.accessToken || localStorage.getItem("gapi_token");
    if (!token) throw new Error("not authenticated");
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { gapi.accessToken = null; localStorage.removeItem("gapi_token"); throw new Error("token expired"); }
    return res.json();
  },

  async findOrCreateSpreadsheet() {
    // Busca planilha existente
    const search = await gapi.request("GET",
      `https://www.googleapis.com/drive/v3/files?q=name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
    );
    if (search.files && search.files.length > 0) return search.files[0].id;

    // Cria nova planilha
    const created = await gapi.request("POST", "https://sheets.googleapis.com/v4/spreadsheets", {
      properties: { title: SPREADSHEET_NAME },
      sheets: [
        { properties: { title: "vehicles" } },
        { properties: { title: "trips" } },
        { properties: { title: "fuels" } },
        { properties: { title: "maintenances" } },
        { properties: { title: "alerts" } },
        { properties: { title: "expenses" } },
        { properties: { title: "monthBalances" } },
      ],
    });
    return created.spreadsheetId;
  },

  async saveData(spreadsheetId, sheetName, data) {
    const rows = [["json"], [JSON.stringify(data)]];
    await gapi.request("PUT",
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:A2?valueInputOption=RAW`,
      { values: rows }
    );
  },

  async loadData(spreadsheetId, sheetName) {
    const res = await gapi.request("GET",
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2`
    );
    if (res.values && res.values[0] && res.values[0][0]) {
      try { return JSON.parse(res.values[0][0]); } catch { return null; }
    }
    return null;
  },
};

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [vehicles, setVehiclesRaw] = useStorage("vehicles", []);
  const [currentVehicleId, setCurrentVehicleId] = useStorage("currentVehicleId", null);
  const [trips, setTripsRaw] = useStorage("trips", []);
  const [fuels, setFuelsRaw] = useStorage("fuels", []);
  const [maintenances, setMaintenancesRaw] = useStorage("maintenances", []);
  const [alerts, setAlertsRaw] = useStorage("alerts", []);
  const [expenses, setExpensesRaw] = useStorage("expenses", []);
  const [monthBalances, setMonthBalancesRaw] = useStorage("monthBalances", {});
  const [setupModal, setSetupModal] = useState(false);
  const [setupForm, setSetupForm] = useState({ name: "", model: "", year: "", currentKm: "", avgKmL: "11" });

  // Google Sheets state
  const [gsUser, setGsUser] = useStorage("gs_user", null);
  const [spreadsheetId, setSpreadsheetId] = useStorage("gs_spreadsheet_id", null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // "ok" | "error" | null
  const [gapiReady, setGapiReady] = useState(false);

  useEffect(() => {
    gapi.init().then(() => setGapiReady(true));
    // Restaurar token salvo
    const saved = localStorage.getItem("gapi_token");
    if (saved) gapi.accessToken = saved;
  }, []);

  // Sync automático sempre que dados mudam
  const syncTimeout = useCallback(
    (() => {
      let t = null;
      return (fn) => { clearTimeout(t); t = setTimeout(fn, 2000); };
    })(), []
  );

  const syncToSheets = useCallback(async (data) => {
    if (!spreadsheetId || !gapi.accessToken) return;
    setSyncing(true);
    try {
      await Promise.all([
        gapi.saveData(spreadsheetId, "vehicles", data.vehicles ?? vehicles),
        gapi.saveData(spreadsheetId, "trips", data.trips ?? trips),
        gapi.saveData(spreadsheetId, "fuels", data.fuels ?? fuels),
        gapi.saveData(spreadsheetId, "maintenances", data.maintenances ?? maintenances),
        gapi.saveData(spreadsheetId, "alerts", data.alerts ?? alerts),
        gapi.saveData(spreadsheetId, "expenses", data.expenses ?? expenses),
        gapi.saveData(spreadsheetId, "monthBalances", data.monthBalances ?? monthBalances),
      ]);
      setSyncStatus("ok");
    } catch (e) {
      setSyncStatus("error");
    } finally {
      setSyncing(false);
    }
  }, [spreadsheetId, vehicles, trips, fuels, maintenances, alerts, expenses, monthBalances]);

  // Wrappers que salvam localmente e disparam sync
  const makeSetter = (raw, key) => (val) => {
    raw(val);
    syncTimeout(() => syncToSheets({ [key]: typeof val === "function" ? val(eval(key)) : val }));
  };

  const setVehicles = (v) => { setVehiclesRaw(v); syncTimeout(() => syncToSheets({ vehicles: typeof v === "function" ? v(vehicles) : v })); };
  const setTrips = (v) => { setTripsRaw(v); syncTimeout(() => syncToSheets({ trips: typeof v === "function" ? v(trips) : v })); };
  const setFuels = (v) => { setFuelsRaw(v); syncTimeout(() => syncToSheets({ fuels: typeof v === "function" ? v(fuels) : v })); };
  const setMaintenances = (v) => { setMaintenancesRaw(v); syncTimeout(() => syncToSheets({ maintenances: typeof v === "function" ? v(maintenances) : v })); };
  const setAlerts = (v) => { setAlertsRaw(v); syncTimeout(() => syncToSheets({ alerts: typeof v === "function" ? v(alerts) : v })); };
  const setExpenses = (v) => { setExpensesRaw(v); syncTimeout(() => syncToSheets({ expenses: typeof v === "function" ? v(expenses) : v })); };
  const setMonthBalances = (v) => { setMonthBalancesRaw(v); syncTimeout(() => syncToSheets({ monthBalances: typeof v === "function" ? v(monthBalances) : v })); };

  const handleGoogleLogin = async () => {
    if (!gapiReady) return;
    setSyncing(true);
    try {
      await gapi.signIn();
      // Buscar info do usuário
      const userInfo = await gapi.request("GET", "https://www.googleapis.com/oauth2/v3/userinfo");
      setGsUser({ name: userInfo.name, email: userInfo.email, picture: userInfo.picture });

      // Encontrar ou criar planilha
      const sheetId = await gapi.findOrCreateSpreadsheet();
      setSpreadsheetId(sheetId);

      // Carregar dados existentes da planilha
      const [v, t, f, m, a, e, mb] = await Promise.all([
        gapi.loadData(sheetId, "vehicles"),
        gapi.loadData(sheetId, "trips"),
        gapi.loadData(sheetId, "fuels"),
        gapi.loadData(sheetId, "maintenances"),
        gapi.loadData(sheetId, "alerts"),
        gapi.loadData(sheetId, "expenses"),
        gapi.loadData(sheetId, "monthBalances"),
      ]);

      if (v && v.length > 0) { setVehiclesRaw(v); setCurrentVehicleId(v[0].id); }
      if (t) setTripsRaw(t);
      if (f) setFuelsRaw(f);
      if (m) setMaintenancesRaw(m);
      if (a) setAlertsRaw(a);
      if (e) setExpensesRaw(e);
      if (mb) setMonthBalancesRaw(mb);

      setSyncStatus("ok");
    } catch (err) {
      setSyncStatus("error");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    gapi.accessToken = null;
    localStorage.removeItem("gapi_token");
    setGsUser(null);
    setSpreadsheetId(null);
    setSyncStatus(null);
  };

  // Primeiro acesso
  useEffect(() => {
    if (vehicles.length === 0) setSetupModal(true);
  }, []);

  const finishSetup = () => {
    if (!setupForm.name) return;
    const v = { ...setupForm, id: uid(), currentKm: +setupForm.currentKm, avgKmL: +setupForm.avgKmL || 11 };
    setVehicles([v]);
    setCurrentVehicleId(v.id);
    setSetupModal(false);
  };

  const navItems = [
    { key: "dashboard", icon: "dashboard", label: "Início" },
    { key: "trips", icon: "route", label: "Percursos" },
    { key: "fuels", icon: "fuel", label: "Combustível" },
    { key: "maintenance", icon: "wrench", label: "Manutenção" },
    { key: "settings", icon: "settings", label: "Config" },
  ];

  const props = { vehicles, setVehicles, currentVehicleId, setCurrentVehicleId, trips, setTrips, fuels, setFuels, maintenances, setMaintenances, alerts, setAlerts, expenses, setExpenses, setTab, monthBalances, setMonthBalances };

  const syncIndicator = syncing ? "⏳" : syncStatus === "ok" ? "☁️" : syncStatus === "error" ? "⚠️" : null;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Barra de login Google */}
        {!gsUser ? (
          <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>Conecte para salvar na nuvem</div>
            <button onClick={handleGoogleLogin} disabled={!gapiReady || syncing}
              style={{ background: theme.accent, color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {syncing ? "Conectando..." : "Entrar com Google"}
            </button>
          </div>
        ) : (
          <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {gsUser.picture && <img src={gsUser.picture} style={{ width: 24, height: 24, borderRadius: "50%" }} alt=""/>}
              <div style={{ fontSize: 12, color: theme.textSecondary }}>{gsUser.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {syncIndicator && <span style={{ fontSize: 14 }} title={syncing ? "Sincronizando..." : syncStatus === "ok" ? "Salvo na nuvem" : "Erro ao sincronizar"}>{syncIndicator}</span>}
              <span style={{ fontSize: 11, color: theme.textMuted, cursor: "pointer" }} onClick={handleLogout}>Sair</span>
            </div>
          </div>
        )}

        {tab === "dashboard" && <Dashboard {...props}/>}
        {tab === "trips" && <Trips {...props}/>}
        {tab === "fuels" && <Fuels {...props}/>}
        {tab === "maintenance" && <Maintenance {...props}/>}
        {tab === "settings" && <Settings {...props}/>}

        <nav className="bottom-nav">
          {navItems.map(n => (
            <button key={n.key} className={`nav-item ${tab === n.key ? "active" : ""}`} onClick={() => setTab(n.key)}>
              <Icon name={n.icon}/>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Setup inicial */}
        {setupModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-handle"/>
              <div style={{ fontSize: 32, textAlign: "center", marginBottom: 8 }}>🚗</div>
              <div className="modal-title" style={{ textAlign: "center" }}>Bem-vindo ao AutoTrack</div>
              <p style={{ fontSize: 14, color: theme.textSecondary, textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
                Vamos começar cadastrando seu veículo.
              </p>

              {/* Login Google dentro do setup */}
              {!gsUser && (
                <div style={{ marginBottom: 16 }}>
                  <button onClick={async () => { await handleGoogleLogin(); }} disabled={!gapiReady || syncing}
                    style={{ width: "100%", background: "#fff", color: "#333", border: `1px solid ${theme.border}`, borderRadius: 14, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span>🔑</span> {syncing ? "Conectando..." : "Entrar com Google primeiro"}
                  </button>
                  <div style={{ textAlign: "center", fontSize: 11, color: theme.textMuted, margin: "10px 0" }}>ou cadastre o veículo sem conta</div>
                </div>
              )}
              {gsUser && (
                <div style={{ background: theme.accentSoft, border: `1px solid ${theme.accent}`, borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  {gsUser.picture && <img src={gsUser.picture} style={{ width: 24, height: 24, borderRadius: "50%" }} alt=""/>}
                  <div style={{ fontSize: 13, color: theme.accent, fontWeight: 500 }}>✓ Conectado como {gsUser.name}</div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Nome / Apelido</label>
                <input className="form-input" placeholder="Ex: Meu Carro" value={setupForm.name} onChange={e => setSetupForm(p => ({ ...p, name: e.target.value }))}/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Modelo</label>
                  <input className="form-input" placeholder="Ex: HB20" value={setupForm.model} onChange={e => setSetupForm(p => ({ ...p, model: e.target.value }))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Ano</label>
                  <input className="form-input" placeholder="2021" value={setupForm.year} onChange={e => setSetupForm(p => ({ ...p, year: e.target.value }))}/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">KM atual</label>
                  <input className="form-input" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={setupForm.currentKm} onChange={e => setSetupForm(p => ({ ...p, currentKm: e.target.value.replace(/\D/g, "") }))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Média km/L</label>
                  <input className="form-input" inputMode="decimal" placeholder="11" value={setupForm.avgKmL} onChange={e => setSetupForm(p => ({ ...p, avgKmL: e.target.value }))}/>
                </div>
              </div>
              <button className="btn btn-primary" onClick={finishSetup}>Começar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
