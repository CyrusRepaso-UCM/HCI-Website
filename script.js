/* ===== CONTENT: edit your info here ===== */
const SKILLS = [
  { n: "Programming",       type: "Psychic / Electric", c: "#f85888", v: 90,  d: 30, pp: 6, desc: "Strong problem-solving and coding abilities",
    say: "used PROGRAMMING! A thunderbolt of clean logic!" },
  { n: "Rapid Adaptation",  type: "Normal / Dynamic",   c: "#a8a878", v: 85,  d: 20, pp: 8, desc: "Adapts easily to new tech stacks",
    say: "used RAPID ADAPTATION! Switched tech stacks mid-battle!" },
  { n: "Fast Learner",      type: "Mind",               c: "#9b6ad8", v: 88,  d: 25, pp: 7, desc: "Quick to grasp complex concepts and workflows",
    say: "used FAST LEARNER! Figured out the bug’s pattern in one turn!" },
  { n: "Unstoppable Effort",type: "Fighting",           c: "#c03028", v: 100, d: 35, pp: 5, desc: "Always gives 100% effort",
    say: "used UNSTOPPABLE EFFORT! Gave it 100%!" },
  { n: "Team Sync",         type: "Support",            c: "#4aa34a", v: 80,  d: 15, pp: 8, desc: "Reliable team player who collaborates well",
    say: "used TEAM SYNC! Stepped out of the comfort zone to team up!", drain: 10 },
  { n: "Growth Mindset",    type: "Fire",               c: "#f08030", v: 95,  d: 25, pp: 7, desc: "Eager to learn and expand knowledge daily",
    say: "used GROWTH MINDSET! Learned something new, power rose!" }
];

const ITEMS = [
  { ic: "🎮", n: "EXP Share",  k: "Gaming",          gain: 10, say: "Used EXP SHARE! Gaming time shares EXP with the whole team." },
  { ic: "🎬", n: "Memory Card",k: "Movies & Cinema", gain: 15, say: "Used MEMORY CARD! A good movie saved to memory. Social battery up a little." },
  { ic: "🍱", n: "Leftovers",  k: "Food & Culinary", gain: 20, say: "Used LEFTOVERS! Good food restores a little energy every turn." },
  { ic: "🎶", n: "Poké Flute", k: "Rest & Recharge", gain: 100, say: "Used POKÉ FLUTE and a Max Revive! Well-earned rest. Fully recharged!" }
];

const TRAITS = [
  "Though naturally quiet, he regularly steps out of his comfort zone to collaborate.",
  "He gives 100% effort on every task. Unstoppable Effort is no joke.",
  "New tech stack? New environment? He adapts quickly and keeps going.",
  "He tackles tough coding challenges to push his own boundaries.",
  "He recharges with gaming, movies, good food, and well-earned sleep."
];

const DEX_ENTRY = "Trainer Cyrus Repaso is an introverted programmer with high adaptability and an insatiable curiosity for technology. Though naturally quiet, he regularly steps out of his comfort zone to collaborate, tackle tough coding challenges, and push his boundaries. Outside of dev work, he recharges with gaming, movies, good food, and well-earned sleep.";
/* ======================================= */

const $ = (s, r = document) => r.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e; };

/* typewriter (each element keeps its own timer) */
function type(node, text, speed = 24, cb) {
  clearInterval(node._t); node.textContent = ""; let i = 0;
  node._t = setInterval(() => {
    node.textContent += text[i++];
    if (i >= text.length) { clearInterval(node._t); cb && cb(); }
  }, speed);
}

/* toast, badges, confetti */
const got = new Set();
function toast(m) {
  const t = $("#toast"); t.textContent = m; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200);
}
function confetti() {
  const em = ["⚡", "🔥", "💧", "🍃", "⭐", "🔴"];
  for (let i = 0; i < 36; i++) {
    const p = el("div", "pf", em[i % em.length]);
    p.style.left = Math.random() * 100 + "vw"; p.style.animationDelay = Math.random() + "s";
    document.body.append(p); setTimeout(() => p.remove(), 3800);
  }
}
function badge(k) {
  if (got.has(k)) return; got.add(k);
  $(`#badges i[data-k=${k}]`).classList.add("on");
  toast(`Badge earned! ${got.size}/5`);
  if (got.size === 5) setTimeout(() => { toast("All 5 badges! Cyrus approves: you’re a Master of Curiosity."); confetti(); }, 2400);
}

/* social battery (introvert mechanic) */
let battery = 60;
function setBattery(v) {
  battery = Math.max(0, Math.min(100, v));
  const b = $("#bat"); b.style.width = battery + "%";
  b.style.background = battery < 30 ? "var(--red)" : battery < 60 ? "#f0c020" : "var(--grass)";
  $("#batN").textContent = battery + "/100";
}

/* intro */
const intro = $("#intro");
let introDone = false;
type($("#introText"), "A wild Cyrus Repaso appeared!", 55, () => setTimeout(endIntro, 900));
function endIntro() {
  if (introDone) return; introDone = true; clearInterval($("#introText")._t);
  intro.classList.add("open");
  setTimeout(() => { intro.classList.add("gone"); startPage(); }, 550);
}
intro.addEventListener("click", endIntro);
intro.addEventListener("keydown", endIntro);

/* photo (falls back to an avatar; click to choose your own) */
const avatar = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#9fd4ff"/><circle cx="50" cy="110" r="42" fill="#e3350d"/><rect x="40" y="62" width="20" height="14" fill="#f2c9a0"/><circle cx="50" cy="45" r="22" fill="#f2c9a0"/><path d="M26 44a24 24 0 0 1 48 0z" fill="#e3350d"/><rect x="22" y="42" width="56" height="7" rx="3" fill="#b82a0a"/><circle cx="50" cy="30" r="6" fill="#fff" stroke="#1d1f3a" stroke-width="2"/><circle cx="42" cy="54" r="2.5" fill="#1d1f3a"/><circle cx="58" cy="54" r="2.5" fill="#1d1f3a"/><path d="M43 62q7 6 14 0" stroke="#1d1f3a" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
const fileInput = '<input type="file" accept="image/*" id="file" hidden>';
function bindFile() {
  $("#file").onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { $("#photoBox").innerHTML = `<img src="${r.result}" alt="Photo of Cyrus Repaso">${fileInput}`; bindFile(); };
    r.readAsDataURL(f);
  };
}
$("#photo").onerror = () => { $("#photoBox").innerHTML = avatar + fileInput; bindFile(); };
bindFile();
$("#photoBox").addEventListener("keydown", e => { if (e.key === "Enter") $("#file").click(); });

/* stats */
SKILLS.forEach(s => {
  $("#statList").append(el("div", "stat",
    `<span>${s.n}<small>${s.type}: ${s.desc}</small></span><div class="bar"><b data-w="${s.v}" style="background:${s.c}"></b></div><span>${s.v}</span>`));
});

/* battle */
let foe = 100;
const say = $("#say");
SKILLS.forEach(s => {
  let pp = s.pp;
  const b = el("button", "mv", `${s.n}<small>${s.type} · PP ${pp}/${s.pp}</small>`);
  b.style.background = s.c;
  b.onclick = () => {
    if (foe <= 0) return;
    pp--; b.querySelector("small").textContent = `${s.type} · PP ${pp}/${s.pp}`;
    if (pp <= 0) b.disabled = true;
    const crit = Math.random() < .3;
    foe = Math.max(0, foe - s.d - (crit ? 10 : 0));
    $("#foeHp").style.width = foe + "%";
    if (s.drain) setBattery(battery - s.drain);
    const f = $("#foe"); f.classList.remove("hit"); void f.offsetWidth; f.classList.add("hit");
    const p = $("#battle .panel"); p.classList.remove("shake"); void p.offsetWidth; p.classList.add("shake");
    type(say, `Cyrus ${s.say}${crit ? " A critical hit!" : ""}`, 22, () => {
      if (foe <= 0) {
        f.classList.add("out");
        setTimeout(() => { type(say, "Wild BUG fainted! Code compiled successfully!"); badge("win"); confetti(); }, 600);
      } else if ([...$("#moves").children].every(x => x.disabled)) {
        type(say, "Out of PP! Refresh the page for a rematch.");
      }
    });
  };
  $("#moves").append(b);
});

/* bag */
ITEMS.forEach(it => {
  const b = el("button", "item", `<span class="ic">${it.ic}</span><b>${it.n}</b><small>${it.k}</small>`);
  b.onclick = () => {
    b.classList.remove("used"); void b.offsetWidth; b.classList.add("used");
    setBattery(battery + it.gain);
    type($("#bagSay"), it.say, 18);
    badge("bag");
  };
  $("#bagList").append(b);
});

/* catch a trait */
let ti = 0, busy = false;
$("#cball").onclick = () => {
  if (busy) return; busy = true;
  const b = $("#cball"); b.classList.remove("throw"); void b.offsetWidth; b.classList.add("throw");
  $("#catchMsg").textContent = "Shake... shake... shake...";
  $("#fact").textContent = "";
  setTimeout(() => {
    if (Math.random() < .7) {
      $("#catchMsg").textContent = "Gotcha! A hidden trait was caught!";
      type($("#fact"), TRAITS[ti++ % TRAITS.length], 20);
      badge("catch");
    } else $("#catchMsg").textContent = "Oh no! It broke free! Try again.";
    busy = false;
  }, 1800);
};

/* shiny mode */
let shiny = false;
$("#shiny").onclick = () => {
  shiny = !shiny;
  $("main").style.transition = "filter .6s";
  $("main").style.filter = shiny ? "hue-rotate(150deg) saturate(1.3)" : "";
  $("#shiny").textContent = shiny ? "✨ Normal" : "✨ Shiny";
  if (shiny) toast("A shiny trainer appeared!");
};

/* after intro: fill bars, reveal sections */
function startPage() {
  setTimeout(() => { setBattery(battery); $("#cur").style.width = "96%"; }, 700);
  const watch = (sel, fn) => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(); io.disconnect(); } }), { threshold: .4 });
    io.observe($(sel));
  };
  watch("#stats", () => {
    document.querySelectorAll("#statList b").forEach((b, i) => setTimeout(() => b.style.width = b.dataset.w + "%", i * 120));
    badge("stats");
  });
  watch("#dex", () => type($("#dexText"), DEX_ENTRY, 14, () => badge("dex")));
}
