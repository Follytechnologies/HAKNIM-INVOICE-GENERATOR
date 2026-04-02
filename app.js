'use strict';

// ─── State ────────────────────────────────────────────────────────────────────
let items = [
  { desc: 'Logo Design & Branding', qty: 1, rate: 50000 },
  { desc: 'Business Card Printing (500 pcs)', qty: 1, rate: 35000 },
];

let logoDataUrl = null;
let zoomLevel   = 100;
const ZOOM_STEP = 25;
const ZOOM_MIN  = 25;
const ZOOM_MAX  = 100;

// ─── Shortcuts ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── Set default dates ────────────────────────────────────────────────────────
(function setDates() {
  const today = new Date();
  const due   = new Date();
  due.setDate(due.getDate() + 14);
  $('issueDate').value = today.toISOString().split('T')[0];
  $('dueDate').value   = due.toISOString().split('T')[0];
})();

// ─── Format currency ──────────────────────────────────────────────────────────
function fmt(n) {
  const sym = $('currency').value || '₦';
  return sym + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Render Line Items (Editor) ───────────────────────────────────────────────
function renderLineItems() {
  const container = $('lineItems');
  container.innerHTML = '';

  items.forEach((item, i) => {
    const total = (item.qty || 0) * (item.rate || 0);
    const el = document.createElement('div');
    el.className = 'line-item';
    el.innerHTML = `
      <button class="item-remove" data-i="${i}" title="Remove">✕</button>
      <input class="item-desc" placeholder="Item description…" value="${escHtml(item.desc)}" data-i="${i}" data-field="desc"/>
      <div class="item-row">
        <div>
          <div class="field-label">Qty</div>
          <input class="item-input" type="number" min="0" value="${item.qty}" data-i="${i}" data-field="qty"/>
        </div>
        <div>
          <div class="field-label">Rate</div>
          <input class="item-input" type="number" min="0" value="${item.rate}" data-i="${i}" data-field="rate"/>
        </div>
        <div>
          <div class="field-label">Amount</div>
          <div class="item-total">${fmt(total)}</div>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  // Item input events
  container.querySelectorAll('.item-desc, .item-input').forEach(inp => {
    inp.addEventListener('input', e => {
      const i = +e.target.dataset.i;
      const field = e.target.dataset.field;
      items[i][field] = field === 'desc' ? e.target.value : parseFloat(e.target.value) || 0;
      renderLineItems();
      updatePreview();
    });
  });

  container.querySelectorAll('.item-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      items.splice(+e.target.dataset.i, 1);
      renderLineItems();
      updatePreview();
    });
  });
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Calculate Totals ─────────────────────────────────────────────────────────
function calcTotals() {
  const subtotal  = items.reduce((s, item) => s + (item.qty || 0) * (item.rate || 0), 0);
  const taxRate   = parseFloat($('taxRate').value)      || 0;
  const discRate  = parseFloat($('discountRate').value) || 0;
  const discount  = subtotal * discRate / 100;
  const taxable   = subtotal - discount;
  const tax       = taxable * taxRate / 100;
  const total     = taxable + tax;
  return { subtotal, discount, discRate, tax, taxRate, total };
}

// ─── Update Invoice Preview ───────────────────────────────────────────────────
function updatePreview() {
  const accent  = $('accentColor').value || '#1a3a5c';
  const invText = $('textColor').value   || '#1a1a18';

  // Apply CSS variables to invoice document
  const inv = $('invoiceDocument');
  inv.style.setProperty('--inv-accent', accent);
  inv.style.setProperty('--inv-text',   invText);

  // Business info
  $('invBizName').textContent  = $('bizName').value || 'Your Business';
  $('invBizName').style.color  = accent;
  $('invBizDetails').innerHTML = [
    $('bizEmail').value,
    $('bizPhone').value,
    $('bizAddress').value.replace(/\n/g, '<br/>')
  ].filter(Boolean).join('<br/>');

  // Logo
  if (logoDataUrl) {
    $('invLogo').src = logoDataUrl;
    $('invLogo').style.display = 'block';
  } else {
    $('invLogo').style.display = 'none';
  }

  // Invoice number & title
  $('invNum').textContent = '#' + ($('invoiceNum').value || '001');

  // Dates
  $('invIssueDate').textContent = fmtDate($('issueDate').value);
  $('invDueDate').textContent   = fmtDate($('dueDate').value);

  // Client
  $('invClientName').textContent  = $('clientName').value || 'Client Name';
  $('invClientDetails').innerHTML = [
    $('clientEmail').value,
    $('clientAddress').value.replace(/\n/g, '<br/>')
  ].filter(Boolean).join('<br/>');

  // Table
  const tbody = $('invTableBody');
  tbody.innerHTML = '';
  items.forEach(item => {
    const amount = (item.qty || 0) * (item.rate || 0);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-desc td-desc">${escHtml(item.desc) || '<span style="color:#ccc">—</span>'}</td>
      <td class="col-qty">${item.qty || 0}</td>
      <td class="col-rate">${fmt(item.rate || 0)}</td>
      <td class="col-amount">${fmt(amount)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals
  const { subtotal, discount, discRate, tax, taxRate, total } = calcTotals();
  const totalsEl = $('invTotals');
  let html = `<div class="totals-line"><span class="totals-label">Subtotal</span><span class="totals-value">${fmt(subtotal)}</span></div>`;
  if (discRate > 0)
    html += `<div class="totals-line"><span class="totals-label">Discount (${discRate}%)</span><span class="totals-value">− ${fmt(discount)}</span></div>`;
  if (taxRate > 0)
    html += `<div class="totals-line"><span class="totals-label">Tax (${taxRate}%)</span><span class="totals-value">${fmt(tax)}</span></div>`;
  html += `<div class="totals-line grand"><span class="totals-label">Total Due</span><span class="totals-value">${fmt(total)}</span></div>`;
  totalsEl.innerHTML = html;

  // Notes & Terms
  $('invNotes').textContent = $('notes').value;
  $('invTerms').textContent = $('terms').value;

  // Footer contact line
  $('invFooterLine').style.background = accent;
}

// ─── Zoom Controls ────────────────────────────────────────────────────────────
function setZoom(z) {
  zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
  $('invoiceWrap').style.transform = `scale(${zoomLevel / 100})`;
  $('zoomVal').textContent = zoomLevel + '%';
}

$('zoomIn').addEventListener('click',  () => setZoom(zoomLevel + ZOOM_STEP));
$('zoomOut').addEventListener('click', () => setZoom(zoomLevel - ZOOM_STEP));

// ─── Logo Upload ──────────────────────────────────────────────────────────────
$('logoArea').addEventListener('click', () => $('logoInput').click());

$('logoInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    logoDataUrl = ev.target.result;
    $('logoPlaceholder').style.display = 'none';
    const img = $('logoPreview');
    img.src = logoDataUrl;
    img.style.display = 'block';
    updatePreview();
  };
  reader.readAsDataURL(file);
});

// ─── Print / Download PDF ─────────────────────────────────────────────────────
$('printBtn').addEventListener('click', () => {
  // Temporarily set full zoom for printing
  const prev = zoomLevel;
  setZoom(100);
  setTimeout(() => {
    window.print();
    setTimeout(() => setZoom(prev), 500);
  }, 100);
});

// ─── New Invoice ──────────────────────────────────────────────────────────────
$('newInvoiceBtn').addEventListener('click', () => {
  if (!confirm('Start a new invoice? All current data will be cleared.')) return;
  items = [{ desc: '', qty: 1, rate: 0 }];
  $('bizName').value      = '';
  $('bizEmail').value     = '';
  $('bizPhone').value     = '';
  $('bizAddress').value   = '';
  $('clientName').value   = '';
  $('clientEmail').value  = '';
  $('clientAddress').value= '';
  $('invoiceNum').value   = 'INV-001';
  $('taxRate').value      = '0';
  $('discountRate').value = '0';
  $('notes').value        = '';
  $('terms').value        = '';
  logoDataUrl = null;
  $('logoPreview').style.display  = 'none';
  $('logoPlaceholder').style.display = 'flex';
  renderLineItems();
  updatePreview();
});

// ─── Add Item ─────────────────────────────────────────────────────────────────
$('addItemBtn').addEventListener('click', () => {
  items.push({ desc: '', qty: 1, rate: 0 });
  renderLineItems();
  updatePreview();
  // Scroll to new item
  $('lineItems').lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ─── Live Update on all inputs ────────────────────────────────────────────────
const liveInputIds = [
  'bizName','bizEmail','bizPhone','bizAddress',
  'clientName','clientEmail','clientAddress',
  'invoiceNum','issueDate','dueDate','currency',
  'taxRate','discountRate','notes','terms',
  'accentColor','textColor'
];

liveInputIds.forEach(id => {
  const el = $(id);
  if (el) {
    el.addEventListener('input',  updatePreview);
    el.addEventListener('change', updatePreview);
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderLineItems();
updatePreview();
setZoom(85); // fit nicely on most screens
