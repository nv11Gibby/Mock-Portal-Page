/* =============================================================
   Imperial Partner Portal — Mock
   Front-end demonstration logic (no backend, no network calls)
   ============================================================= */

/* ---- Service catalogue --------------------------------------------- */
const SERVICES = [
  { name: "Antigua and Barbuda Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Antigua and Barbuda", timeline: "6 - 9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Argentina Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Argentina", timeline: "TBC", provider: "Imperial Citizenship", status: "Pending Review" },
  { name: "Austria Citizenship by Exceptional Achievements", group: "Imperial Mobility", category: "Citizenship by Exceptional Achievements", type: "Imperial Direct Services", jurisdiction: "Austria", timeline: "12 - 36 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Botswana Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Botswana", timeline: "3 - 6 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Dominica Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Dominica", timeline: "6 - 9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Egypt Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Egypt", timeline: "6 - 9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Grenada Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Grenada", timeline: "6 - 9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Jordan Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Jordan", timeline: "3 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Nauru Economic and Climate Resilience Citizenship Program", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Nauru", timeline: "3 - 4 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "São Tomé and Príncipe Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "São Tomé and Príncipe", timeline: "1 - 2 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "St. Kitts and Nevis Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "St. Kitts and Nevis", timeline: "6 - 9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Saint Lucia Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Saint Lucia", timeline: "6 - 9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Türkiye Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Türkiye", timeline: "3 - 4 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Vanuatu Citizenship by Investment", group: "Imperial Mobility", category: "Citizenship by Investment", type: "Imperial Direct Services", jurisdiction: "Vanuatu", timeline: "3 - 6 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Cyprus Permanent Residency by Investment", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Cyprus", timeline: "9 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Greece Golden Visa", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Greece", timeline: "2 - 3 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Hungary Guest Investor Program", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Hungary", timeline: "3 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Italy Investor Visa", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Italy", timeline: "3 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Latvia Residency by Investment", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Latvia", timeline: "3 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Malta Permanent Residence Programme (MPRP)", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Malta", timeline: "3 - 6 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Monaco Residency by Financial Self-Sufficiency", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Monaco", timeline: "3 - 6 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Portugal Golden Visa", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Portugal", timeline: "4 - 6 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "Qatar Residency by Real Estate Investment", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Qatar", timeline: "2 - 6 Weeks", provider: "Imperial Citizenship", status: "Active" },
  { name: "Saudi Arabia Premium Residency", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "Saudi Arabia", timeline: "1 Month", provider: "Imperial Citizenship", status: "Active" },
  { name: "UAE Golden Visa", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "United Arab Emirates", timeline: "2 - 4 Weeks", provider: "Imperial Citizenship", status: "Active" },
  { name: "United States EB-5 Immigrant Investor Program", group: "Imperial Mobility", category: "Residency by Investment", type: "Imperial Direct Services", jurisdiction: "United States", timeline: "12 - 30 Months", provider: "Imperial Citizenship", status: "Active" },
  { name: "UAE Company Formation", group: "Imperial Privileges", category: "Company Formation", type: "Imperial Direct Services", jurisdiction: "United Arab Emirates", timeline: "1 - 2 Weeks", provider: "Imperial Citizenship", status: "Active" }
];

/* ---- DOM helpers ---------------------------------------------------- */
const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* Escape user/data-driven strings before injecting into markup. */
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

/* ---- Toast ---------------------------------------------------------- */
let toastTimer;
function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---- Session / view switching -------------------------------------- */
function showApp() {
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
  localStorage.setItem("imperialMockSession", "1");
  renderServices();
  drawCharts();
}

$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showApp();
});

$("#demoLogin").addEventListener("click", () => {
  $("#email").value = "partner@imperial.demo";
  $("#password").value = "Demo123!";
});

$("#logout").addEventListener("click", () => {
  localStorage.removeItem("imperialMockSession");
  location.reload();
});

/* ---- Navigation ----------------------------------------------------- */
$$(".nav button[data-page]").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".nav button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    $$(".page").forEach((p) => p.classList.remove("active"));
    $("#" + btn.dataset.page).classList.add("active");

    $(".sidebar").classList.remove("open");
    window.scrollTo(0, 0);

    if (btn.dataset.page === "reports") drawCharts();
  });
});

$("#mobileMenu").addEventListener("click", () => {
  $(".sidebar").classList.toggle("open");
});

/* ---- Services table ------------------------------------------------- */
function renderServices() {
  const query    = ($("#serviceSearch")?.value || "").toLowerCase();
  const category = $("#categoryFilter")?.value || "All";
  const status   = $("#statusFilter")?.value || "All";

  const rows = SERVICES.filter((s) => {
    const matchesQuery = !query ||
      (s.name + s.jurisdiction + s.category).toLowerCase().includes(query);
    const matchesCategory = category === "All" || s.category === category;
    const matchesStatus   = status === "All" || s.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  $("#serviceRows").innerHTML = rows.map((s) => {
    const statusClass = s.status === "Active" ? "active" : "pending";
    const jurisdiction = escapeHTML(s.jurisdiction);
    return `<tr>
      <td><strong>${escapeHTML(s.name)}</strong></td>
      <td>${escapeHTML(s.category)}</td>
      <td>${jurisdiction}</td>
      <td>${escapeHTML(s.timeline)}</td>
      <td>${escapeHTML(s.provider)}</td>
      <td><span class="status ${statusClass}">${escapeHTML(s.status)}</span></td>
      <td><button class="secondary" data-toast="Interest registered for ${jurisdiction}">View</button></td>
    </tr>`;
  }).join("");

  $("#serviceCount").textContent = `${rows.length} services`;
  bindToastButtons($("#serviceRows"));
}

["serviceSearch", "categoryFilter", "statusFilter"].forEach((id) => {
  $("#" + id)?.addEventListener("input", renderServices);
});

/* ---- Lightweight canvas charts ------------------------------------- */
function drawLine(canvasId, values, labels) {
  const c = $("#" + canvasId);
  if (!c) return;

  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = c.clientHeight;
  c.width = w * dpr;
  c.height = h * dpr;

  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const pad = 34, min = 0, max = Math.max(...values) * 1.16;

  // Gridlines
  ctx.strokeStyle = "#e7dfd2";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = pad + (h - pad * 2) * i / 4;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }

  // Trend line
  ctx.beginPath();
  values.forEach((v, i) => {
    const px = pad + (w - pad * 2) * i / (values.length - 1);
    const py = h - pad - (v - min) / (max - min) * (h - pad * 2);
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  });
  ctx.strokeStyle = "#b8892f";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Points + labels
  values.forEach((v, i) => {
    const px = pad + (w - pad * 2) * i / (values.length - 1);
    const py = h - pad - v / max * (h - pad * 2);
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#b8892f";
    ctx.fill();
    ctx.fillStyle = "#777168";
    ctx.font = "11px sans-serif";
    ctx.fillText(labels[i], px - 10, h - 10);
  });
}

function drawBars(canvasId, values, labels) {
  const c = $("#" + canvasId);
  if (!c) return;

  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = c.clientHeight;
  c.width = w * dpr;
  c.height = h * dpr;

  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const pad = 35;
  const max = Math.max(...values) * 1.15;
  const bw = (w - pad * 2) / values.length * 0.55;

  values.forEach((v, i) => {
    const px = pad + (i + 0.5) * (w - pad * 2) / values.length - bw / 2;
    const bh = v / max * (h - pad * 2);
    const py = h - pad - bh;

    const g = ctx.createLinearGradient(0, py, 0, h - pad);
    g.addColorStop(0, "#d6b05b");
    g.addColorStop(1, "#8f6518");
    ctx.fillStyle = g;
    ctx.fillRect(px, py, bw, bh);

    ctx.fillStyle = "#777168";
    ctx.font = "11px sans-serif";
    ctx.fillText(labels[i], px, h - 10);
  });
}

function drawCharts() {
  requestAnimationFrame(() => {
    drawLine("activityChart",
      [7, 11, 14, 13, 17, 20, 19, 24, 27, 31, 36, 42],
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]);
    drawBars("categoryChart",
      [14, 12, 1],
      ["Citizenship", "Residency", "Formation"]);
  });
}

window.addEventListener("resize", drawCharts);

/* ---- Toast-triggering buttons -------------------------------------- */
function bindToastButtons(root = document) {
  $$("[data-toast]", root).forEach((btn) => {
    if (btn.dataset.toastBound) return;
    btn.dataset.toastBound = "1";
    btn.addEventListener("click", () => toast(btn.dataset.toast));
  });
}
bindToastButtons();

/* ---- Boot ----------------------------------------------------------- */
if (localStorage.getItem("imperialMockSession")) showApp();
