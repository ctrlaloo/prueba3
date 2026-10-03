const C = SITE_CONFIG;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const rand = a => a[Math.floor(Math.random() * a.length)];
const T = s => String(s).replace(/\{name\}/g, C.person.name).replace(/\{nick\}/g, C.person.nickname);
const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const GAMES = {};

/* ---------- state ---------- */
const KEY = "experience:" + C.storageKey;
const S = { name: "", authed: false, done: {}, secrets: [], music: false, sfx: true, letter: false, unlockSeen: false };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const pct = () => Math.round((Object.keys(S.done).length + (S.letter ? 1 : 0)) / C.sections.length * 100);

/* ---------- sound (synthesized, no files) ---------- */
let ac;
function tone(f, d = .1, type = "sine", v = .05, delay = 0) {
  if (!S.sfx) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d);
  } catch (e) {}
}
const seq = (fs, d = .18, v = .05) => fs.forEach((f, i) => tone(f, d, "sine", v, i * .1));
const SFX = {
  click: () => tone(520, .05, "square", .025), hover: () => tone(900, .03, "sine", .012),
  good: () => seq([660, 880], .15), bad: () => tone(160, .25, "sawtooth", .04),
  win: () => seq([523, 659, 784, 1047], .25), unlock: () => seq([392, 523, 659, 784, 1047], .3),
  secret: () => seq([880, 1175, 1568], .25)
};
const sfx = n => SFX[n] && SFX[n]();

/* ---------- ui helpers ---------- */
function say(msg, ms = 3400) {
  const b = $("#bubble"); b.textContent = T(msg); b.classList.add("on");
  clearTimeout(say.t); say.t = setTimeout(() => b.classList.remove("on"), ms);
}
function sparkle(x, y) {
  for (let i = 0; i < 5; i++) {
    const s = document.createElement("span"), a = Math.random() * 6.28;
    s.className = "kw"; s.textContent = rand(["✦", "♥", "✧"]); s.style.left = x + "px"; s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(a) * 30 + "px"); s.style.setProperty("--dy", Math.sin(a) * 30 - 10 + "px");
    document.body.append(s); setTimeout(() => s.remove(), 700);
  }
}
function whisper(msg, ms = 2800, cls = "") {
  const sc = document.body.dataset.screen;
  if (!cls && sc && sc !== "login") return say(msg, ms);
  const t = $("#toast"); t.textContent = msg; t.className = "on " + cls;
  clearTimeout(whisper.t); whisper.t = setTimeout(() => t.classList.remove("on"), ms);
}
let idleT;
function idle() { clearTimeout(idleT); if (S.authed) idleT = setTimeout(() => whisper(C.messages.idle), C.timing.idleMs); }
function show(id) { document.body.dataset.screen = id; $$(".screen").forEach(s => s.classList.toggle("on", s.id === id)); window.scrollTo(0, 0); idle(); }
async function cine(lines, ms = 1900, red = false) {
  const o = $("#overlay"); o.className = "on" + (red ? " red" : "");
  for (const l of lines) { o.innerHTML = `<p>${T(l)}</p>`; await wait(ms); }
}
const endCine = () => { $("#overlay").className = ""; };

/* ---------- secrets ---------- */
function secret(id) {
  const s = C.secrets.find(x => x.id === id);
  if (!s || S.secrets.includes(id)) return;
  S.secrets.push(id); save(); sfx("secret");
  whisper("SECRET FOUND 🕷️ — " + T(s.msg), 4800, "secret");
  const f = $("#found"); if (f) f.textContent = `SECRETS FOUND: ${S.secrets.length}`;
}

/* ---------- end-of-game panel ---------- */
let cleanup = () => {};
function endPanel(stage, { ok, id, title, line, retry }) {
  if (ok) { S.done[id] = 1; save(); }
  sfx(ok ? "win" : "bad"); whisper(rand(ok ? C.mascot.win : C.mascot.fail));
  stage.innerHTML = `<div class="panel rise" style="text-align:center"><p class="kick">${ok ? "COMPLETE" : "NOT YET"}</p><h2>${T(title)}</h2><p style="margin-top:12px">${T(line)}</p>${ok ? `<p class="love">${T(rand(C.loveNotes))}</p>` : ""}</div>
  <div class="row">${retry ? `<button class="cta" id="rt">${ok ? "PLAY AGAIN" : "TRY AGAIN"}</button>` : ""}<button class="ghost" id="hb">BACK TO HUB</button></div>`;
  $("#hb", stage).onclick = () => $("#back").click();
  if (retry) $("#rt", stage).onclick = () => { sfx("click"); cleanup(); cleanup = GAMES[id](stage) || (() => {}); };
}
function burst(host, x, y) {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span"), a = i / 8 * 6.28;
    s.className = "spark"; s.style.left = x + "px"; s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(a) * 36 + "px"); s.style.setProperty("--dy", Math.sin(a) * 36 + "px");
    host.append(s); setTimeout(() => s.remove(), 650);
  }
}

/* ---------- hub ---------- */
function renderHub(back) {
  const n = Object.keys(S.done).length, need = C.sections.length - 1, all = n >= need;
  $("#hubTitle").textContent = C.messages.hubTitle;
  if (!back && n < need) setTimeout(() => say(rand(C.mascot.lines)), 900);
  $("#cards").innerHTML = C.sections.map((s, i) => {
    const lock = s.id === "final" && !all, done = S.done[s.id] || (s.id === "final" && S.letter);
    return `<button class="card${lock ? " locked" : ""}${done ? " done" : ""}" data-id="${s.id}" ${lock ? 'aria-disabled="true"' : ""}><small>0${i + 1}<span class="ic">${C.icons[s.id] || ""}</span></small><b>${s.title}</b></button>`;
  }).join("");
  const p = pct();
  $("#prog").innerHTML = `<div class="bar">${Array.from({ length: 10 }, (_, i) => `<i class="${i < p / 10 ? "f" : ""}"></i>`).join("")}</div><small class="sub">EXPERIENCE ${p}%</small>`;
  $("#found").textContent = `SECRETS FOUND: ${S.secrets.length}`;
  if (all && !S.unlockSeen) {
    S.unlockSeen = true; save(); sfx("unlock"); whisper(C.messages.unlocked, 4500);
    $('[data-id="final"]').classList.add("pulse");
  } else if (back && n > 0 && !all) whisper(C.messages.exploring);
}
function openGame(id) {
  sfx("click"); cleanup(); show("game");
  const st = $("#stage"); st.innerHTML = "";
  cleanup = GAMES[id](st) || (() => {});
}
async function finalSequence() {
  sfx("unlock");
  await cine(C.messages.finalSeq, 2400, true);
  renderLetter(); S.letter = true; save(); endCine(); show("letter");
}
function renderLetter() {
  $("#letterTitle").textContent = T(C.messages.finalTitle).toUpperCase();
  $("#letterBody").innerHTML = C.letter.map((l, i) => l ? `<p style="animation-delay:${i * .8}s">${T(l)}</p>` : "<br>").join("");
  $("#gallery").innerHTML = C.photos.map(p => `<figure class="pol"><img src="${p.src}" alt="${p.caption}" loading="lazy" onerror="this.parentNode.classList.add('ph')"><figcaption>${p.caption}</figcaption></figure>`).join("");
  const d = C.letter.length * .8 + .6;
  ["#gallery", "#endRow"].forEach(s => { $(s).style.animation = `in 1s ${d}s both`; });
}

/* ---------- login ---------- */
async function intro() {
  const l1 = $("#l1"), l2 = $("#l2");
  l1.textContent = C.messages.intro1; l1.className = "rise"; await wait(2000);
  l2.textContent = C.messages.intro2; l2.className = "sub rise"; await wait(1800);
  $("#form").hidden = false; $("#inName").focus();
}
async function submitLogin(e) {
  e.preventDefault();
  const n = norm($("#inName").value), p = norm($("#inPass").value), form = $("#form");
  const names = [C.person.name, C.person.nickname, ...(C.access.extraNames || [])].map(norm);
  const bad = !names.includes(n) ? rand(C.messages.wrongName) : p !== norm(C.access.password) ? rand(C.messages.wrongPass) : "";
  if (bad) {
    $("#err").textContent = bad; sfx("bad");
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake"); return;
  }
  S.name = $("#inName").value.trim(); S.authed = true; save(); sfx("unlock");
  await cine([C.messages.granted, C.messages.welcome], 1800);
  renderHub(); show("hub"); endCine();
}

/* ---------- music / reset ---------- */
const audio = new Audio(C.music.src); audio.loop = true; audio.volume = .4;
function musicUI() { const b = $("#musicBtn"); b.setAttribute("aria-pressed", String(S.music)); b.textContent = S.music ? "♪ MUSIC ON" : "♪ MUSIC"; }
function playMusic() { audio.play().catch(() => { S.music = false; musicUI(); whisper("Add a music file at " + C.music.src); }); }
function reset() { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }

/* ---------- init ---------- */
function init() {
  const r = document.documentElement.style;
  r.setProperty("--bg", C.colors.background); r.setProperty("--p", C.colors.primary); r.setProperty("--t", C.colors.text); r.setProperty("--a", C.colors.accent);
  document.title = C.title;
  const w = $("#web").cloneNode(true); w.id = ""; w.classList.add("br"); document.body.append(w);

  $("#form").onsubmit = submitLogin;
  $("#back").onclick = () => { sfx("click"); cleanup(); cleanup = () => {}; renderHub(true); show("hub"); };
  $("#cards").onclick = e => {
    const c = e.target.closest(".card"); if (!c) return;
    if (c.dataset.id === "final") return Object.keys(S.done).length >= C.sections.length - 1 ? finalSequence() : (sfx("bad"), whisper(C.messages.locked, 3200));
    openGame(c.dataset.id);
  };
  $("#cards").onmouseover = e => { if (e.target.closest(".card")) sfx("hover"); };
  $("#again").onclick = reset;
  $("#explore").onclick = () => { renderHub(); show("hub"); };
  $("#gallery").onclick = e => {
    const f = e.target.closest(".pol"); if (!f) return;
    sfx("click"); $("#lightbox").innerHTML = `<figure class="${f.className}">${f.innerHTML}</figure>`; $("#lightbox").hidden = false;
  };
  $("#lightbox").onclick = () => { $("#lightbox").hidden = true; };

  $("#musicBtn").onclick = () => { S.music = audio.paused; save(); S.music ? playMusic() : audio.pause(); musicUI(); };
  const sx = () => { $("#sfxBtn").textContent = S.sfx ? "SFX ON" : "SFX OFF"; $("#sfxBtn").setAttribute("aria-pressed", String(S.sfx)); };
  $("#sfxBtn").onclick = () => { S.sfx = !S.sfx; save(); sx(); sfx("click"); };
  let rs; $("#resetBtn").onclick = () => {
    if (rs) return reset();
    const b = $("#resetBtn"); rs = setTimeout(() => { rs = 0; b.textContent = "RESET EXPERIENCE"; }, 3000); b.textContent = "SURE? CLICK AGAIN";
  };
  sx(); musicUI();
  addEventListener("pointerdown", function once() { if (S.music && audio.paused) playMusic(); removeEventListener("pointerdown", once); });

  ["pointerdown", "keydown"].forEach(ev => addEventListener(ev, idle));
  const clicks = {};
  addEventListener("click", e => {
    const el = e.target.closest("[data-secret]"); if (!el) return;
    const s = C.secrets.find(x => x.id === el.dataset.secret); if (!s) return;
    clicks[s.id] = (clicks[s.id] || 0) + 1;
    if (s.nudgeAt && clicks[s.id] === s.nudgeAt) whisper(s.nudge);
    if (clicks[s.id] >= s.clicks) secret(s.id);
  });
  let buf = "";
  addEventListener("keydown", e => {
    if (e.target.matches("input") || e.key.length > 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-20);
    C.secrets.filter(s => s.type === "type" && buf.endsWith(s.value)).forEach(s => secret(s.id));
  });

  let pets = 0;
  $("#pet").onclick = () => {
    pets++; sfx("good"); say(rand(C.mascot.pet), 2200);
    const m = $("#pet").getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const s = document.createElement("span"); s.className = "fl"; s.textContent = "♥";
      s.style.left = m.left + 14 + Math.random() * 50 + "px"; s.style.top = m.top + "px";
      document.body.append(s); setTimeout(() => s.remove(), 1100);
    }
    if (pets >= 10) secret("pet");
  };
  addEventListener("pointermove", e => {
    const m = $("#pet").getBoundingClientRect(), dx = e.clientX - (m.left + m.width / 2), dy = e.clientY - (m.top + m.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(3, d / 40);
    $$("#pet .pu").forEach(p => { p.style.transform = `translate(${dx / d * k}px,${dy / d * k}px)`; });
  });
  addEventListener("pointerdown", e => { if (!e.target.closest("#arena,#pet")) sparkle(e.clientX, e.clientY); });
  fx();
  renderLetter();
  if (S.authed) { renderHub(); show("hub"); } else { show("login"); intro(); }
}

/* ---------- background particles ---------- */
function fx() {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const c = $("#fx"), x = c.getContext("2d"); let w, h;
  const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight; }; rs(); addEventListener("resize", rs);
  const STARS = Array.from({ length: 18 }, () => ({ x: Math.random() * w, y: Math.random() * h, o: Math.random() * 6 }));
  const P = Array.from({ length: 45 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .4, v: Math.random() * .3 + .08, a: Math.random() * .5 + .1 }));
  (function f() {
    x.clearRect(0, 0, w, h); x.fillStyle = C.colors.primary;
    P.forEach(p => { p.y -= p.v; if (p.y < 0) { p.y = h; p.x = Math.random() * w; } x.globalAlpha = p.a; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); });
    x.fillStyle = C.colors.accent; x.font = "11px sans-serif";
    STARS.forEach(s => { x.globalAlpha = .15 + .5 * Math.abs(Math.sin(Date.now() / 1300 + s.o)); x.fillText("✦", s.x, s.y); });
    requestAnimationFrame(f);
  })();
}
const App = { init };
