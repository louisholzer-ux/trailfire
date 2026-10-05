const STORAGE_KEY = "trailfire-v1";

const defaultState = () => ({
  horse: {
    name: "Dusty",
    age: 9,
    level: "Fortgeschrittene Grundlagen",
    notes: "Mag klare Übergänge. Am Tor links ungeduldig. Stangen ok, Plane noch mit Abstand.",
    weak: "links"
  },
  xp: 420,
  sessionMin: 35,
  discipline: "hm",
  logs: [],
  completions: {},
  days: {},
  freezes: {},
  created: new Date().toISOString()
});

let state = load();
let player = null;
let toastTimer = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (e) {
    return seed();
  }
}

function seed() {
  const s = defaultState();
  const today = startOfDay(new Date());
  const samples = [
    { off: 1, ids: ["hm-seat", "hm-stop", "hm-bend"], d: "hm", min: 35 },
    { off: 2, ids: ["tr-bridge", "tr-stand", "tr-serp"], d: "tr", min: 28 },
    { off: 3, ids: ["bw-lead", "bw-side", "bw-desen"], d: "bw", min: 22 },
    { off: 5, ids: ["hm-rein", "hm-back", "wp-jog"], d: "wp", min: 30 }
  ];
  samples.forEach((sample, si) => {
    const day = new Date(today);
    day.setDate(day.getDate() - sample.off);
    const key = iso(day);
    s.days[key] = { min: sample.min, xp: 70 + si * 8, discipline: sample.d };
    sample.ids.forEach((id) => {
      const q = 3.5 + (si % 2) * 0.4;
      s.logs.push({ id, date: key, quality: q, clean: true, note: "" });
      s.completions[id] = (s.completions[id] || 0) + (q >= 3.2 ? 1 : 0.5);
    });
  });
  return s;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function iso(d) {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${x.getFullYear()}-${m}-${day}`;
}
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function weekKey(d) {
  const x = startOfDay(d);
  const day = x.getDay() || 7;
  x.setDate(x.getDate() - day + 1);
  return iso(x);
}

function streakInfo() {
  const today = startOfDay(new Date());
  let cursor = new Date(today);
  if (!state.days[iso(cursor)]) cursor = addDays(cursor, -1);
  let count = 0;
  const guard = 400;
  for (let i = 0; i < guard; i++) {
    const key = iso(cursor);
    if (state.days[key] || state.freezes[key]) {
      if (state.days[key]) count += 1;
      cursor = addDays(cursor, -1);
    } else break;
  }
  let longest = count;
  const keys = Object.keys(state.days).sort();
  if (keys.length) {
    let run = 0;
    let prev = null;
    keys.forEach((k) => {
      if (!prev) run = 1;
      else {
        const diff = (startOfDay(k) - startOfDay(prev)) / 86400000;
        run = diff === 1 || (diff === 2 && state.freezes[iso(addDays(prev, 1))]) ? run + 1 : 1;
      }
      prev = k;
      longest = Math.max(longest, run);
    });
  }
  return { current: count, longest, todayDone: !!state.days[iso(today)] };
}

function flameTier(n) {
  return FLAME_TIERS.find((t) => n >= t.min) || FLAME_TIERS[FLAME_TIERS.length - 1];
}

function levelFromXp(xp) {
  return Math.floor(xp / 180) + 1;
}
function levelProgress(xp) {
  return (xp % 180) / 180;
}

function rankFor(points) {
  let current = RANKS[0];
  RANKS.forEach((r) => {
    if (points >= r.min) current = r;
  });
  const idx = RANKS.findIndex((r) => r.id === current.id);
  const next = RANKS[idx + 1];
  return { current, next, points: points || 0 };
}

function exerciseById(id) {
  return EXERCISES.find((e) => e.id === id);
}
function discById(id) {
  return DISCIPLINES.find((d) => d.id === id);
}

function missedYesterday() {
  const y = iso(addDays(startOfDay(new Date()), -1));
  const before = iso(addDays(startOfDay(new Date()), -2));
  return !state.days[y] && !state.freezes[y] && !!state.days[before];
}
function freezeAvailable() {
  return !state.freezes[weekKey(new Date()) + "-used"] && !state.freezes[iso(addDays(startOfDay(new Date()), -1))];
}

function useFreeze() {
  const y = iso(addDays(startOfDay(new Date()), -1));
  if (!missedYesterday() || !freezeAvailable()) {
    toast("Freeze gerade nicht einsetzbar.");
    return;
  }
  state.freezes[y] = true;
  state.freezes[weekKey(new Date()) + "-used"] = true;
  save();
  toast("Freeze gelegt. Die Serie hält.");
  render();
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}
function buildSession() {
  const minutes = state.sessionMin;
  const pool = EXERCISES.filter((e) => e.d === state.discipline);
  const seed = iso(new Date()) + state.discipline + minutes + (state.horse.weak || "");
  const scored = pool.map((e) => {
    const pts = state.completions[e.id] || 0;
    let score = 20 - Math.min(pts, 18);
    if (e.side && state.horse.weak) score += 4;
    const recent = state.logs.slice(-8).some((l) => l.id === e.id);
    if (recent) score -= 5;
    return { e, score: score + (hashStr(seed + e.id) % 10) / 10 };
  }).sort((a, b) => b.score - a.score);
  const picked = [];
  let used = 0;
  scored.forEach(({ e }) => {
    if (used + e.min <= minutes + 4 && picked.length < 5) {
      picked.push(e);
      used += e.min;
    }
  });
  if (!picked.length) picked.push(scored[0].e);
  return picked;
}

function openPlayer() {
  const items = buildSession().map((e) => ({
    id: e.id,
    done: false,
    note: "",
    ratings: { sitz: 3, timing: 3, ruhig: 3, hilfe: 3 },
    seconds: 0
  }));
  player = {
    items,
    index: 0,
    started: Date.now(),
    running: true,
    acc: 0,
    tickAt: Date.now()
  };
  document.getElementById("player").classList.add("on");
  renderPlayer();
}

function closePlayer(confirmAbort) {
  if (confirmAbort && player && !player.items.every((i) => i.done)) {
    if (!window.confirm("Session abbrechen? Fortschritt dieser Runde geht verloren.")) return;
  }
  player = null;
  document.getElementById("player").classList.remove("on");
}

function currentItem() {
  return player.items[player.index];
}

function tick() {
  if (!player || !player.running) return;
  const now = Date.now();
  player.acc += now - player.tickAt;
  player.tickAt = now;
  const el = document.getElementById("timer");
  if (el) el.textContent = formatTime(Math.floor(player.acc / 1000));
}
setInterval(tick, 250);

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function finishExercise() {
  const item = currentItem();
  item.done = true;
  item.seconds = Math.floor(player.acc / 1000);
  player.running = false;
  renderPlayer();
}

function rateAndNext() {
  const item = currentItem();
  ["sitz", "timing", "ruhig", "hilfe"].forEach((k) => {
    const el = document.getElementById("rate-" + k);
    if (el) item.ratings[k] = Number(el.value);
  });
  const note = document.getElementById("ex-note");
  if (note) item.note = note.value.trim();
  if (player.index < player.items.length - 1) {
    player.index += 1;
    player.acc = 0;
    player.tickAt = Date.now();
    player.running = true;
    renderPlayer();
  } else {
    completeSession();
  }
}

function completeSession() {
  const key = iso(new Date());
  let xp = 36;
  player.items.forEach((item) => {
    const vals = Object.values(item.ratings);
    const quality = vals.reduce((a, b) => a + b, 0) / vals.length;
    const clean = quality >= 3.2;
    state.logs.push({ id: item.id, date: key, quality, clean, note: item.note });
    state.completions[item.id] = (state.completions[item.id] || 0) + (clean ? 1 : 0.5);
    xp += 12 + Math.round(quality * 2);
  });
  const mins = Math.max(1, Math.round((Date.now() - player.started) / 60000));
  xp += Math.min(mins, 50);
  const info = streakInfo();
  if (!state.days[key]) xp += 10 + Math.min(info.current, 12);
  state.xp += xp;
  state.days[key] = {
    min: (state.days[key]?.min || 0) + mins,
    xp: (state.days[key]?.xp || 0) + xp,
    discipline: state.discipline
  };
  save();
  burst();
  closePlayer(false);
  toast(`Session steht. +${xp} XP`);
  show("today");
  render();
}

function burst() {
  const el = document.getElementById("burst");
  el.classList.add("on");
  setTimeout(() => el.classList.remove("on"), 1300);
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 2400);
}

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("on"));
  document.getElementById("screen-" + id).classList.add("on");
  document.querySelectorAll(".navbtn").forEach((b) => b.classList.toggle("on", b.dataset.screen === id));
  window.scrollTo(0, 0);
}

function flameSvg(active) {
  const c = active ? "#ff6a1a" : "#5c4638";
  const c2 = active ? "#ffb15a" : "#8a7060";
  return `<svg viewBox="0 0 64 64" class="flame-wrap" aria-hidden="true">
    <path fill="${c}" d="M32 6c2 8 0 10-4 16 6-2 10 2 10 8 6-6 8-14 6-22 10 8 14 20 10 30-4 16-16 22-22 22s-18-6-22-22c-2-10 2-18 8-24 2 8 6 10 8 8-2-6-1-12 6-16z"/>
    <path fill="${c2}" d="M32 28c4 6 2 10-2 14 4 0 8 4 6 10-4 4-10 4-12-2 0-6 4-8 4-12 2-4 2-8 4-10z"/>
  </svg>`;
}

function renderToday() {
  const info = streakInfo();
  const tier = flameTier(info.current);
  const disc = discById(state.discipline);
  const plan = buildSession();
  const weak = state.horse.weak === "links" ? "linke Seite" : "rechte Seite";
  const freezeHtml = missedYesterday()
    ? `<button class="btn" style="margin-top:10px" onclick="useFreeze()">${freezeAvailable() ? "Freeze für gestern einsetzen" : "Freeze diese Woche schon genutzt"}</button>`
    : "";
  document.getElementById("screen-today").innerHTML = `
    <div class="brand">
      <div class="mark">${flameSvg(true)}</div>
      <div>
        <h1>Trailfire</h1>
        <p>Western-Training für ${escapeHtml(state.horse.name)}</p>
      </div>
    </div>
    <section class="card flame-hero">
      ${flameSvg(info.current > 0)}
      <div>
        <div class="kicker">${tier.name}</div>
        <h2 style="margin-bottom:4px">${info.current} ${info.current === 1 ? "Tag" : "Tage"}</h2>
        <div class="dim">${tier.line}</div>
      </div>
    </section>
    <div class="stats">
      <div class="stat"><b>${info.current}</b><span>Serie</span></div>
      <div class="stat"><b>${info.longest}</b><span>Rekord</span></div>
      <div class="stat"><b>${info.todayDone ? "an" : "aus"}</b><span>Heute</span></div>
    </div>
    ${freezeHtml}
    <section class="card" style="margin-top:12px">
      <div class="kicker">Heute</div>
      <h3>${state.sessionMin} Minuten ${escapeHtml(disc.name)}</h3>
      <p class="dim">Schwache Seite: ${weak}. Die Runde bevorzugt Übungen, die dort zählen, und lässt das letzte Training etwas liegen.</p>
      <div class="seg" style="margin:10px 0">
        ${[20, 35, 50].map((n) => `<button class="${state.sessionMin === n ? "on" : ""}" onclick="setMin(${n})">${n} min</button>`).join("")}
      </div>
      <div class="chips" style="margin-bottom:10px">
        ${DISCIPLINES.map((d) => `<button class="chip ${state.discipline === d.id ? "on" : ""}" onclick="setDisc('${d.id}')">${d.name}</button>`).join("")}
      </div>
      ${plan.map((e, i) => `<div class="dim" style="margin:6px 0">${i + 1}. ${escapeHtml(e.name)} · ${e.reps}</div>`).join("")}
      <button class="btn primary" style="margin-top:12px" onclick="openPlayer()">${info.todayDone ? "Noch eine Runde" : "Session starten"}</button>
    </section>
    ${installCard()}
  `;
}


function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function installCard() {
  if (isStandalone()) return "";
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const steps = ios
    ? "<li>Diese Seite in Safari öffnen, nicht in Grok.</li><li>Unten auf das Teilen-Symbol tippen.</li><li>Zum Home-Bildschirm tippen.</li><li>Hinzufügen. Danach startet Trailfire als eigenes Icon, ohne Grok.</li>"
    : "<li>Diese Seite in Chrome öffnen.</li><li>Menü oben rechts öffnen.</li><li>App installieren oder Zum Startbildschirm hinzufügen wählen.</li><li>Danach liegt Trailfire neben den anderen Apps und öffnet im Vollbild.</li>";
  return `<section class="card install-card">
    <div class="kicker">Aufs Handy</div>
    <h3>Wie eine normale App</h3>
    <p class="dim">Einmal zum Home-Bildschirm legen. Training, Flamme und Pferd bleiben auf dem Gerät. Grok brauchst du dafür nicht mehr.</p>
    <ol>${steps}</ol>
  </section>`;
}

function setMin(n) { state.sessionMin = n; save(); renderToday(); }
function setDisc(id) { state.discipline = id; save(); renderToday(); }

function renderLibrary() {
  const q = (document.getElementById("lib-q")?.value || "").toLowerCase();
  const d = document.getElementById("lib-d")?.value || "all";
  const w = document.getElementById("lib-w")?.value || "all";
  const t = document.getElementById("lib-t")?.value || "all";
  const list = EXERCISES.filter((e) => {
    if (d !== "all" && e.d !== d) return false;
    if (w !== "all" && e.where !== w) return false;
    if (t === "short" && e.min > 7) return false;
    if (t === "mid" && (e.min < 8 || e.min > 9)) return false;
    if (t === "long" && e.min < 10) return false;
    if (q && !`${e.name} ${discById(e.d).name}`.toLowerCase().includes(q)) return false;
    return true;
  });
  document.getElementById("screen-library").innerHTML = `
    <div class="kicker">Bibliothek</div>
    <h2>Übungen</h2>
    <input id="lib-q" placeholder="Suchen, z. B. Gate oder Lope" value="${escapeHtml(q)}" oninput="renderLibrary()" />
    <div class="filters">
      <select id="lib-d" onchange="renderLibrary()">
        <option value="all">Alle Disziplinen</option>
        ${DISCIPLINES.map((x) => `<option value="${x.id}" ${d === x.id ? "selected" : ""}>${x.name}</option>`).join("")}
      </select>
      <select id="lib-w" onchange="renderLibrary()">
        <option value="all">Boden & Sattel</option>
        <option value="sattel" ${w === "sattel" ? "selected" : ""}>Sattel</option>
        <option value="boden" ${w === "boden" ? "selected" : ""}>Boden</option>
      </select>
      <select id="lib-t" onchange="renderLibrary()">
        <option value="all">Jede Dauer</option>
        <option value="short" ${t === "short" ? "selected" : ""}>kurz</option>
        <option value="mid" ${t === "mid" ? "selected" : ""}>mittel</option>
        <option value="long" ${t === "long" ? "selected" : ""}>lang</option>
      </select>
    </div>
    <div class="stack">
      ${list.map((e) => {
        const r = rankFor(state.completions[e.id] || 0);
        return `<button class="ex-card" onclick="openDetail('${e.id}')">
          <span><b>${escapeHtml(e.name)}</b><span class="dim">${discById(e.d).name} · ${e.min} min · ${e.where}</span></span>
          <span class="badge ${r.current.id}">${r.current.label}</span>
        </button>`;
      }).join("") || `<div class="card">Nichts gefunden. Filter lockern.</div>`}
    </div>
  `;
}

function openDetail(id) {
  const e = exerciseById(id);
  const r = rankFor(state.completions[e.id] || 0);
  const next = r.next ? `${r.next.label} ab ${r.next.min} sauberen Logs` : "Elite gehalten";
  document.getElementById("sheet").innerHTML = `
    <div class="kicker">${discById(e.d).name}</div>
    <h2>${escapeHtml(e.name)}</h2>
    <span class="badge ${r.current.id}">${r.current.label} · ${r.points.toFixed(1)} Punkte</span>
    <p class="dim">${next}. ${e.side ? "Zählt auf die schwache Seite." : "Beide Seiten gleich."}</p>
    <h3>Ziel</h3><p>${escapeHtml(e.goal)}</p>
    <h3>Setup</h3><p>${escapeHtml(e.setup)}</p>
    <h3>Ablauf</h3><ol class="steps">${e.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
    <h3>Häufige Fehler</h3><ul class="steps">${e.errors.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
    <h3>Steigerung</h3><p>${escapeHtml(e.up)}</p>
    <p class="dim">Richtwert ${escapeHtml(e.reps)} · ca. ${e.min} Minuten</p>
    <button class="btn primary" onclick="startSingle('${e.id}')">Nur diese Übung reiten</button>
    <button class="btn ghost" onclick="closeSheet()">Schließen</button>
  `;
  document.getElementById("overlay").classList.add("on");
}
function closeSheet() { document.getElementById("overlay").classList.remove("on"); }
function startSingle(id) {
  closeSheet();
  state.discipline = exerciseById(id).d;
  player = {
    items: [{ id, done: false, note: "", ratings: { sitz: 3, timing: 3, ruhig: 3, hilfe: 3 }, seconds: 0 }],
    index: 0,
    started: Date.now(),
    running: true,
    acc: 0,
    tickAt: Date.now()
  };
  document.getElementById("player").classList.add("on");
  renderPlayer();
}

function renderPlayer() {
  if (!player) return;
  const item = currentItem();
  const e = exerciseById(item.id);
  const pos = `${player.index + 1} / ${player.items.length}`;
  const weakNote = e.side ? `<span class="side-tag">Schwache Seite heute: ${state.horse.weak}</span>` : "";
  document.getElementById("player-body").innerHTML = item.done ? `
    <div class="kicker">Selbstbewertung · ${pos}</div>
    <h2>${escapeHtml(e.name)}</h2>
    <p class="dim">Ehrlich loggen. Ab 3,2 im Schnitt zählt der Durchgang voll für den Rang.</p>
    ${rateRow("sitz", "Sitz", item.ratings.sitz)}
    ${rateRow("timing", "Timing", item.ratings.timing)}
    ${rateRow("ruhig", "Pferd ruhig", item.ratings.ruhig)}
    ${rateRow("hilfe", "Hilfe leicht", item.ratings.hilfe)}
    <label class="field"><span>Notiz</span><textarea id="ex-note" placeholder="Was war sauber, was beim nächsten Mal?">${escapeHtml(item.note)}</textarea></label>
    <button class="btn primary" style="margin-top:12px" onclick="rateAndNext()">${player.index === player.items.length - 1 ? "Session abschließen" : "Nächste Übung"}</button>
  ` : `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div class="kicker">${discById(e.d).name} · ${pos}</div>
      <button class="btn small" onclick="closePlayer(true)">Abbrechen</button>
    </div>
    <h2>${escapeHtml(e.name)}</h2>
    ${weakNote}
    <div class="timer" id="timer">${formatTime(Math.floor(player.acc / 1000))}</div>
    <div class="dim">Richtwert ${escapeHtml(e.reps)} · ca. ${e.min} min</div>
    <div class="row" style="margin:10px 0">
      <button class="btn" onclick="toggleRun()">${player.running ? "Pause" : "Weiter"}</button>
      <button class="btn primary" onclick="finishExercise()">Übung fertig</button>
    </div>
    <section class="card">
      <div class="kicker">Ziel</div>
      <p>${escapeHtml(e.goal)}</p>
      <div class="kicker">Ablauf</div>
      <ol class="steps">${e.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
      <div class="kicker">Fehler</div>
      <ul class="steps">${e.errors.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
    </section>
  `;
}
function rateRow(id, label, val) {
  return `<label class="field"><span>${label}: <b id="lbl-${id}">${val}</b></span>
    <input id="rate-${id}" type="range" min="1" max="5" step="1" value="${val}" oninput="document.getElementById('lbl-${id}').textContent=this.value" /></label>`;
}
function toggleRun() {
  if (!player) return;
  if (player.running) player.running = false;
  else {
    player.running = true;
    player.tickAt = Date.now();
  }
  renderPlayer();
}

function renderProgress() {
  const info = streakInfo();
  const tier = flameTier(info.current);
  const lvl = levelFromXp(state.xp);
  const days = [...Array(7)].map((_, i) => {
    const d = addDays(startOfDay(new Date()), i - 6);
    const key = iso(d);
    return { key, label: d.toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2), on: !!state.days[key], freeze: !!state.freezes[key], today: key === iso(new Date()) };
  });
  const weeks = [...Array(8)].map((_, i) => {
    const end = addDays(startOfDay(new Date()), -7 * (7 - i));
    let min = 0;
    for (let k = 0; k < 7; k++) {
      const day = state.days[iso(addDays(end, -k))];
      if (day) min += day.min;
    }
    return min;
  });
  const max = Math.max(20, ...weeks);
  const pts = weeks.map((v, i) => `${(i / 7) * 300},${110 - (v / max) * 96}`).join(" ");
  const byDisc = DISCIPLINES.map((d) => {
    const ex = EXERCISES.filter((e) => e.d === d.id);
    const avg = ex.reduce((a, e) => a + (state.completions[e.id] || 0), 0) / ex.length;
    const r = rankFor(avg);
    return { d, avg, r };
  });
  document.getElementById("screen-progress").innerHTML = `
    <div class="kicker">Fortschritt</div>
    <h2>Level ${lvl}</h2>
    <div class="barline"><span>${state.xp} XP</span><span>nächstes Level bei ${lvl * 180}</span></div>
    <div class="track"><i style="width:${Math.round(levelProgress(state.xp) * 100)}%"></i></div>
    <section class="card" style="margin-top:12px">
      <div class="kicker">${tier.name}</div>
      <div class="week" style="margin-top:8px">
        ${days.map((d) => `<div class="day ${d.on ? "on" : ""} ${d.today ? "today" : ""}">${d.freeze && !d.on ? "❄" : d.on ? "🔥" : "·"}<span>${d.label}</span></div>`).join("")}
      </div>
      <p class="dim">Serie ${info.current} · Rekord ${info.longest}. Freeze einmal pro Woche, wenn genau ein Tag fehlt.</p>
    </section>
    <section class="card">
      <div class="kicker">Minuten, 8 Wochen</div>
      <svg class="chart" viewBox="0 0 300 120">
        <polyline fill="none" stroke="#ff6a1a" stroke-width="3" points="${pts}" />
      </svg>
    </section>
    <section class="card">
      <div class="kicker">Disziplin-Ränge</div>
      <div class="bars">
        ${byDisc.map((x) => `<div>
          <div class="barline"><span>${x.d.name}</span><span class="badge ${x.r.current.id}">${x.r.current.label}</span></div>
          <div class="track"><i style="width:${Math.min(100, (x.avg / 45) * 100)}%"></i></div>
        </div>`).join("")}
      </div>
    </section>
  `;
}

function renderHorse() {
  const h = state.horse;
  document.getElementById("screen-horse").innerHTML = `
    <div class="kicker">Pferd</div>
    <h2>${escapeHtml(h.name || "Dein Pferd")}</h2>
    <section class="card">
      <label class="field"><span>Name</span><input id="h-name" value="${escapeHtml(h.name)}" /></label>
      <label class="field"><span>Alter</span><input id="h-age" type="number" min="2" max="40" value="${h.age}" /></label>
      <label class="field"><span>Ausbildungsstand</span><input id="h-level" value="${escapeHtml(h.level)}" /></label>
      <label class="field"><span>Schwache Seite</span>
        <select id="h-weak">
          <option value="links" ${h.weak === "links" ? "selected" : ""}>links</option>
          <option value="rechts" ${h.weak === "rechts" ? "selected" : ""}>rechts</option>
        </select>
      </label>
      <label class="field"><span>Notizen</span><textarea id="h-notes">${escapeHtml(h.notes)}</textarea></label>
      <button class="btn primary" style="margin-top:12px" onclick="saveHorse()">Profil sichern</button>
    </section>
    <section class="card">
      <div class="kicker">Beispiel</div>
      <p class="dim">Dusty ist schon da, damit die Bahn nicht leer ist. Name, Alter und Notizen kannst du überschreiben. Alles bleibt in diesem Browser, ohne Konto.</p>
      <button class="btn" onclick="resetAll()">Daten zurücksetzen</button>
    </section>
  `;
}
function saveHorse() {
  state.horse = {
    name: document.getElementById("h-name").value.trim() || "Dusty",
    age: Number(document.getElementById("h-age").value) || 9,
    level: document.getElementById("h-level").value.trim(),
    weak: document.getElementById("h-weak").value,
    notes: document.getElementById("h-notes").value.trim()
  };
  save();
  toast("Pferd gespeichert.");
  render();
}
function resetAll() {
  if (!window.confirm("Alle lokalen Trailfire-Daten löschen und Dusty neu anlegen?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = seed();
  save();
  toast("Neu aufgesetzt.");
  render();
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;")
    .replace(/'/g, "\u0026#39;");
}

function render() {
  renderToday();
  if (document.getElementById("screen-library").classList.contains("on")) renderLibrary();
  if (document.getElementById("screen-progress").classList.contains("on")) renderProgress();
  if (document.getElementById("screen-horse").classList.contains("on")) renderHorse();
}

document.querySelectorAll(".navbtn").forEach((b) => {
  b.addEventListener("click", () => {
    const id = b.dataset.screen;
    show(id);
    if (id === "library") renderLibrary();
    if (id === "progress") renderProgress();
    if (id === "horse") renderHorse();
    if (id === "today") renderToday();
  });
});

save();
renderToday();
show("today");

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
