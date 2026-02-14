// ==================== CONFIG ====================
const API = 'https://script.google.com/macros/s/AKfycbzTLCLhgZ4Hnnums48mByAvESEjNtHeK6Aj7CbAJTcPvve9C2qJ122Cl6-cKC7Mzqw/exec';

const HEB_DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HOUR_START = 7;
const HOUR_END = 22;

// ==================== STATE ====================
let state = {
  slots: [], tenants: [], types: [],
  activeTab: 'calendar',
  calView: 'month',
  calDate: new Date()
};

// ==================== API ====================
async function apiGet(entity) {
  try {
    const res = await fetch(`${API}?entity=${entity}`);
    return await res.json() || [];
  } catch (e) { toast('שגיאה בטעינת נתונים', 'error'); return []; }
}

async function apiPost(action, entity, data, id) {
  try {
    const body = { action, entity, data };
    if (id) body.id = Number(id);
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body)
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'שגיאה');
    return result.result;
  } catch (e) { toast(e.message || 'שגיאה', 'error'); throw e; }
}

async function loadAll() {
  const [slots, tenants, types] = await Promise.all([
    apiGet('slots'), apiGet('tenants'), apiGet('types')
  ]);
  state.slots = Array.isArray(slots) ? slots : [];
  state.tenants = Array.isArray(tenants) ? tenants : [];
  state.types = Array.isArray(types) ? types : [];
  renderAll();
}

// ==================== LOOKUPS ====================
function tenantName(id) {
  const t = state.tenants.find(x => Number(x.id) === Number(id));
  return t ? t.name : `#${id}`;
}
function typeName(id) {
  const t = state.types.find(x => Number(x.id) === Number(id));
  return t ? t.name : `#${id}`;
}
function typeChipsForTenant(typesStr) {
  if (!typesStr) return '—';
  return String(typesStr).split(',').map(id => {
    const t = state.types.find(x => Number(x.id) === Number(id.trim()));
    return t ? `<span class="type-chip">${t.name}</span>` : '';
  }).filter(Boolean).join(' ');
}
function tenantColor(id) { return `tenant-c${Number(id) % 8}`; }

// ==================== DATE UTILS ====================
function fmtDate(d) {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function toInputDate(dateStr) {
  if (!dateStr) return '';
  const p = dateStr.split('/');
  return p.length === 3 ? `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}` : '';
}
function fromInputDate(iso) {
  if (!iso) return '';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function parseDMY(s) {
  if (!s) return null;
  const p = String(s).split('/');
  if (p.length !== 3) return null;
  return new Date(Number(p[2]), Number(p[1])-1, Number(p[0]));
}
function asDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function boolish(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  const s = String(v || '').trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}
function isRecurringSlot(slot) {
  return boolish(slot && slot.is_recurring);
}
function sameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function timeToMin(t) {
  if (!t) return 0;
  const [h,m] = String(t).split(':').map(Number);
  return (h||0)*60 + (m||0);
}
function weekStart(d) {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay());
  return r;
}

// ==================== RENDER ALL ====================
function renderAll() {
  renderSlots(); renderTenants(); renderTypes(); renderCalendar();
}

// ==================== TABLE RENDERS ====================
function renderSlots() {
  const body = document.getElementById('slots-body');
  document.getElementById('slots-count').textContent = state.slots.length;
  if (!state.slots.length) {
    body.innerHTML = '<tr><td colspan="7"><div class="empty"><div class="empty-icon">📅</div>אין תורים</div></td></tr>';
    return;
  }
  const sortedSlots = [...state.slots].sort((a, b) => {
    const ad = parseDMY(a.date);
    const bd = parseDMY(b.date);
    const at = (ad ? ad.getTime() : 0) + timeToMin(a.start_time) * 60000;
    const bt = (bd ? bd.getTime() : 0) + timeToMin(b.start_time) * 60000;
    return bt - at;
  });
  body.innerHTML = sortedSlots.map(s => `<tr>
    <td>${s.date||'—'}${isRecurringSlot(s) ? ` <span title="חוזר עד ${s.recurring_till || '—'}">🔁</span>` : ''}</td>
    <td>${s.start_time||'—'}</td>
    <td>${s.end_time||'—'}</td>
    <td>${tenantName(s.tenant_id)}</td>
    <td><span class="type-chip">${typeName(s.type_id)}</span></td>
    <td>${s.client_name||'—'}</td>
    <td class="actions-cell">
      <button class="btn btn-ghost btn-sm" onclick="openSlotModal(${s.id})">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDelete('slots',${s.id})">🗑</button>
    </td>
  </tr>`).join('');
}

function renderTenants() {
  const body = document.getElementById('tenants-body');
  document.getElementById('tenants-count').textContent = state.tenants.length;
  if (!state.tenants.length) {
    body.innerHTML = '<tr><td colspan="4"><div class="empty"><div class="empty-icon">👤</div>אין מטפלים</div></td></tr>';
    return;
  }
  body.innerHTML = state.tenants.map(t => `<tr>
    <td><strong>${t.name}</strong></td>
    <td>${typeChipsForTenant(t.types)}</td>
    <td style="direction:ltr;text-align:right">${t.email||'—'}</td>
    <td class="actions-cell">
      <button class="btn btn-ghost btn-sm" onclick="openTenantModal(${t.id})">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDelete('tenants',${t.id})">🗑</button>
    </td>
  </tr>`).join('');
}

function renderTypes() {
  const body = document.getElementById('types-body');
  document.getElementById('types-count').textContent = state.types.length;
  if (!state.types.length) {
    body.innerHTML = '<tr><td colspan="3"><div class="empty"><div class="empty-icon">🏷</div>אין סוגי טיפול</div></td></tr>';
    return;
  }
  body.innerHTML = state.types.map(t => `<tr>
    <td><strong>${t.name}</strong></td>
    <td>${t.class_among_can ? '<span class="bool-yes">✓ כן</span>' : '<span class="bool-no">✗ לא</span>'}</td>
    <td class="actions-cell">
      <button class="btn btn-ghost btn-sm" onclick="openTypeModal(${t.id})">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDelete('types',${t.id})">🗑</button>
    </td>
  </tr>`).join('');
}

// ==================== TABS ====================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const name = tab.dataset.tab;
    state.activeTab = name;
    document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
    document.getElementById(`panel-${name}`).style.display = '';
    if (name === 'calendar') renderCalendar();
  });
});

// ==================== CALENDAR ====================
function setCalView(v) {
  state.calView = v;
  document.querySelectorAll('[data-calview]').forEach(b => b.classList.toggle('active', b.dataset.calview === v));
  renderCalendar();
}
function calNav(dir) {
  const d = state.calDate;
  if (state.calView === 'month') d.setMonth(d.getMonth() + dir);
  else if (state.calView === 'week') d.setDate(d.getDate() + dir * 7);
  else d.setDate(d.getDate() + dir);
  renderCalendar();
}
function calToday() { state.calDate = new Date(); renderCalendar(); }

function slotsForDate(date) {
  const target = asDateOnly(date);
  return state.slots.filter(s => {
    const base = parseDMY(s.date);
    if (!base) return false;

    if (!isRecurringSlot(s)) return sameDay(base, target);

    const baseDay = asDateOnly(base);
    const till = parseDMY(s.recurring_till);
    const tillDay = till ? asDateOnly(till) : baseDay;
    if (target < baseDay || target > tillDay) return false;
    return target.getDay() === baseDay.getDay();
  }).sort((a, b) => timeToMin(a.start_time) - timeToMin(b.start_time));
}

function renderCalendar() {
  const container = document.getElementById('cal-container');
  const titleEl = document.getElementById('cal-title');
  if (state.calView === 'month') renderMonthView(container, titleEl);
  else if (state.calView === 'week') renderWeekView(container, titleEl);
  else renderDayView(container, titleEl);
}

// ---- MONTH VIEW ----
function renderMonthView(container, titleEl) {
  const d = state.calDate;
  const year = d.getFullYear(), month = d.getMonth();
  titleEl.textContent = `${HEB_MONTHS[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date();
  const prevDays = new Date(year, month, 0).getDate();

  let html = '<div class="cal-month-grid">';
  for (let i = 0; i < 7; i++) html += `<div class="day-header">${HEB_DAYS[i]}</div>`;

  for (let i = 0; i < startOffset; i++) {
    html += `<div class="day-cell other-month"><div class="day-num">${prevDays - startOffset + i + 1}</div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const isToday = sameDay(cellDate, today);
    const events = slotsForDate(cellDate);
    html += `<div class="day-cell${isToday?' today':''}" onclick="calDayClick('${fmtDate(cellDate)}')">`;
    html += `<div class="day-num">${day}</div>`;
    events.slice(0, 3).forEach(ev => {
      const t = ev.start_time || '';
      html += `<div class="cal-event ${tenantColor(ev.tenant_id)}" onclick="event.stopPropagation();openSlotModal(${ev.id})">${t} ${tenantName(ev.tenant_id)}</div>`;
    });
    if (events.length > 3) html += `<div style="font-size:0.68rem;color:var(--text-secondary);padding:0 6px">+${events.length-3} עוד</div>`;
    html += '</div>';
  }

  const totalCells = startOffset + daysInMonth;
  const remaining = (7 - totalCells % 7) % 7;
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="day-cell other-month"><div class="day-num">${i}</div></div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

// ---- WEEK VIEW ----
function renderWeekView(container, titleEl) {
  const ws = weekStart(state.calDate);
  const days = [];
  for (let i = 0; i < 7; i++) { const dd = new Date(ws); dd.setDate(dd.getDate()+i); days.push(dd); }
  titleEl.textContent = `${fmtDate(days[0])} — ${fmtDate(days[6])}`;
  renderTimeGrid(container, days);
}

// ---- DAY VIEW ----
function renderDayView(container, titleEl) {
  const d = state.calDate;
  titleEl.textContent = `יום ${HEB_DAYS[d.getDay()]} — ${fmtDate(d)}`;
  renderTimeGrid(container, [d]);
}

// ---- TIME GRID (week + day) ----
function renderTimeGrid(container, days) {
  const cols = days.length;
  const today = new Date();
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);
  const cellH = 52;

  let html = '<div class="cal-time-grid">';

  // Header
  html += `<div class="tg-header" style="grid-template-columns:50px repeat(${cols}, 1fr)">`;
  html += '<div class="tg-header-cell" style="border-inline-start:none"></div>';
  days.forEach(d => {
    const isToday = sameDay(d, today);
    html += `<div class="tg-header-cell${isToday?' today-col':''}">יום ${HEB_DAYS[d.getDay()]}<br>${d.getDate()}/${d.getMonth()+1}</div>`;
  });
  html += '</div>';

  // Body
  html += `<div class="tg-body" style="grid-template-columns:50px repeat(${cols}, 1fr)">`;
  hours.forEach(h => {
    html += `<div class="tg-time-label">${String(h).padStart(2,'0')}:00</div>`;
    days.forEach(d => {
      const isToday = sameDay(d, today);
      const dateStr = fmtDate(d);
      html += `<div class="tg-cell${isToday?' today-col':''}" onclick="calCellClick('${dateStr}','${String(h).padStart(2,'0')}:00')">`;

      // Events starting in this hour
      slotsForDate(d).filter(ev => {
        const st = timeToMin(ev.start_time);
        return Math.floor(st / 60) === h;
      }).forEach(ev => {
        const st = timeToMin(ev.start_time);
        const et = ev.end_time ? timeToMin(ev.end_time) : st + 60;
        const topOff = (st % 60) / 60 * cellH;
        const height = Math.max(((et - st) / 60) * cellH, 22);
        html += `<div class="tg-event ${tenantColor(ev.tenant_id)}" style="top:${topOff}px;height:${height}px" onclick="event.stopPropagation();openSlotModal(${ev.id})">`;
        html += `<span class="ev-time">${ev.start_time}–${ev.end_time||''}</span>`;
        html += `<span class="ev-name"> ${ev.client_name || typeName(ev.type_id)}</span>`;
        html += '</div>';
      });

      html += '</div>';
    });
  });
  html += '</div></div>';
  container.innerHTML = html;
}

function calDayClick(dateStr) {
  const p = dateStr.split('/');
  state.calDate = new Date(Number(p[2]), Number(p[1])-1, Number(p[0]));
  setCalView('day');
}
function calCellClick(dateStr, time) {
  openSlotModal(null, dateStr, time);
}

// ==================== MODALS ====================
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// -- SLOT MODAL --
function openSlotModal(editId, prefillDate, prefillTime) {
  const slot = editId ? state.slots.find(s => Number(s.id)===Number(editId)) : null;
  const isEdit = !!slot;

  const dateVal = slot ? toInputDate(slot.date) : (prefillDate ? toInputDate(prefillDate) : '');
  const startVal = slot ? (slot.start_time||'') : (prefillTime||'');
  const endVal = slot ? (slot.end_time||'') : '';
  const recurringVal = isRecurringSlot(slot);
  const recurringTillVal = slot ? toInputDate(slot.recurring_till || '') : '';

  const tenantOpts = state.tenants.map(t =>
    `<option value="${t.id}" ${slot&&Number(slot.tenant_id)===Number(t.id)?'selected':''}>${t.name}</option>`
  ).join('');
  const typeOpts = state.types.map(t =>
    `<option value="${t.id}" ${slot&&Number(slot.type_id)===Number(t.id)?'selected':''}>${t.name}</option>`
  ).join('');

  openModal(`
    <h3>${isEdit?'עריכת תור':'תור חדש'}</h3>
    <div class="form-group">
      <label>תאריך</label>
      <input type="date" id="f-date" value="${dateVal}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>שעת התחלה</label>
        <input type="time" id="f-start" value="${startVal}">
      </div>
      <div class="form-group">
        <label>שעת סיום</label>
        <input type="time" id="f-end" value="${endVal}">
      </div>
    </div>
    <div class="form-group">
      <label>מטפל</label>
      <select id="f-tenant"><option value="">בחר...</option>${tenantOpts}</select>
    </div>
    <div class="form-group">
      <label>סוג טיפול</label>
      <select id="f-type"><option value="">בחר...</option>${typeOpts}</select>
    </div>
    <div class="form-group">
      <label>שם לקוח</label>
      <input type="text" id="f-client" value="${slot?slot.client_name||'':''}" placeholder="שם הלקוח">
    </div>
    <div class="form-group">
      <label class="checkbox-item" style="border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-hover)">
        <input type="checkbox" id="f-recurring" ${recurringVal ? 'checked' : ''} onchange="toggleRecurringTill()">
        <span class="cb-label">אירוע חוזר (שבועי)</span>
      </label>
    </div>
    <div class="form-group" id="f-recurring-till-wrap" style="display:${recurringVal ? 'block' : 'none'}">
      <label>חוזר עד</label>
      <input type="date" id="f-recurring-till" value="${recurringTillVal}">
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="saveSlot(${editId||'null'})">${isEdit?'שמור':'הוסף'}</button>
      <button class="btn btn-ghost" onclick="closeModal()">ביטול</button>
    </div>
  `);
}

function toggleRecurringTill() {
  const recurring = document.getElementById('f-recurring')?.checked;
  const wrap = document.getElementById('f-recurring-till-wrap');
  if (!wrap) return;
  wrap.style.display = recurring ? 'block' : 'none';
}

async function saveSlot(editId) {
  const recurring = document.getElementById('f-recurring')?.checked;
  const recurringTillIso = document.getElementById('f-recurring-till')?.value || '';
  const data = {
    date: fromInputDate(document.getElementById('f-date').value),
    start_time: document.getElementById('f-start').value,
    end_time: document.getElementById('f-end').value,
    tenant_id: Number(document.getElementById('f-tenant').value),
    type_id: Number(document.getElementById('f-type').value),
    client_name: document.getElementById('f-client').value.trim(),
    is_recurring: !!recurring,
    recurring_till: recurring ? fromInputDate(recurringTillIso) : ''
  };
  if (!data.date || !data.start_time || !data.tenant_id || !data.type_id) {
    toast('נא למלא תאריך, שעת התחלה, מטפל וסוג','error'); return;
  }
  if (data.is_recurring && !data.recurring_till) {
    toast('נא לבחור תאריך סיום לחזרתיות','error'); return;
  }
  if (data.is_recurring) {
    const startDate = parseDMY(data.date);
    const tillDate = parseDMY(data.recurring_till);
    if (!startDate || !tillDate || asDateOnly(tillDate) < asDateOnly(startDate)) {
      toast('תאריך "חוזר עד" חייב להיות מאוחר או שווה לתאריך התור','error'); return;
    }
  }
  try {
    if (editId) { await apiPost('update','slots',data,editId); toast('התור עודכן','success'); }
    else { await apiPost('add','slots',data); toast('התור נוסף','success'); }
    closeModal(); await loadAll();
  } catch(e){}
}

// -- TENANT MODAL (FIXED CHECKBOXES) --
function openTenantModal(editId) {
  const tenant = editId ? state.tenants.find(t => Number(t.id)===Number(editId)) : null;
  const isEdit = !!tenant;
  const sel = tenant ? String(tenant.types).split(',').map(s=>s.trim()) : [];

  const typeChecks = state.types.map(t => `
    <label class="checkbox-item">
      <input type="checkbox" class="type-check" value="${t.id}" ${sel.includes(String(t.id))?'checked':''}>
      <span class="cb-label">${t.name}</span>
    </label>
  `).join('');

  openModal(`
    <h3>${isEdit?'עריכת מטפל':'מטפל חדש'}</h3>
    <div class="form-group">
      <label>שם</label>
      <input type="text" id="f-name" value="${tenant?tenant.name:''}" placeholder="שם המטפל">
    </div>
    <div class="form-group">
      <label>אימייל</label>
      <input type="email" id="f-email" dir="ltr" value="${tenant?tenant.email||'':''}" placeholder="email@example.com">
    </div>
    <div class="form-group">
      <label>סוגי טיפול</label>
      <div class="checkbox-list">${typeChecks || '<div style="padding:12px;color:var(--text-secondary)">אין סוגי טיפול במערכת</div>'}</div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="saveTenant(${editId||'null'})">${isEdit?'שמור':'הוסף'}</button>
      <button class="btn btn-ghost" onclick="closeModal()">ביטול</button>
    </div>
  `);
}

async function saveTenant(editId) {
  const types = [...document.querySelectorAll('.type-check:checked')].map(c=>c.value).join(',');
  const data = {
    name: document.getElementById('f-name').value.trim(),
    email: document.getElementById('f-email').value.trim(),
    types
  };
  if (!data.name) { toast('נא להזין שם','error'); return; }
  try {
    if (editId) { await apiPost('update','tenants',data,editId); toast('המטפל עודכן','success'); }
    else { await apiPost('add','tenants',data); toast('המטפל נוסף','success'); }
    closeModal(); await loadAll();
  } catch(e){}
}

// -- TYPE MODAL --
function openTypeModal(editId) {
  const type = editId ? state.types.find(t => Number(t.id)===Number(editId)) : null;
  const isEdit = !!type;
  openModal(`
    <h3>${isEdit?'עריכת סוג טיפול':'סוג טיפול חדש'}</h3>
    <div class="form-group">
      <label>שם</label>
      <input type="text" id="f-tname" value="${type?type.name:''}" placeholder="שם סוג הטיפול">
    </div>
    <div class="form-group">
      <label class="checkbox-item" style="border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-hover)">
        <input type="checkbox" id="f-class" ${type&&type.class_among_can?'checked':''}>
        <span class="cb-label">שיעור קבוצתי (class)</span>
      </label>
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="saveType(${editId||'null'})">${isEdit?'שמור':'הוסף'}</button>
      <button class="btn btn-ghost" onclick="closeModal()">ביטול</button>
    </div>
  `);
}

async function saveType(editId) {
  const data = {
    name: document.getElementById('f-tname').value.trim(),
    class_among_can: document.getElementById('f-class').checked
  };
  if (!data.name) { toast('נא להזין שם','error'); return; }
  try {
    if (editId) { await apiPost('update','types',data,editId); toast('סוג הטיפול עודכן','success'); }
    else { await apiPost('add','types',data); toast('סוג הטיפול נוסף','success'); }
    closeModal(); await loadAll();
  } catch(e){}
}

// ==================== DELETE ====================
function confirmDelete(entity, id) {
  const labels = { slots:'תור', tenants:'מטפל', types:'סוג טיפול' };
  openModal(`
    <h3>מחיקת ${labels[entity]}</h3>
    <p style="margin-bottom:20px;color:var(--text-secondary)">האם למחוק? פעולה זו אינה ניתנת לביטול.</p>
    <div class="modal-actions">
      <button class="btn btn-primary" style="background:var(--danger)" onclick="doDelete('${entity}',${id})">מחק</button>
      <button class="btn btn-ghost" onclick="closeModal()">ביטול</button>
    </div>
  `);
}
async function doDelete(entity, id) {
  try {
    await apiPost('delete',entity,{},id);
    toast('נמחק בהצלחה','success');
    closeModal(); await loadAll();
  } catch(e){}
}

// ==================== TOAST ====================
function toast(msg, type='') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ==================== INIT ====================
loadAll();
