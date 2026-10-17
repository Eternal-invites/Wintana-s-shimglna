/* ═══════════════════════════════════════════════
   የዊንታና ሽምግልና — የግብዣው ስክሪፕት
   እኛ ልንቆጥር የምንችለው ቀን እና ሰዓት እዚህ ነው (በአንድ ቦታ ብቻ ማስተካከል ካስፈለገ):
   ═══════════════════════════════════════════════ */

// የግብዣው ቀን: ህዳር 6 2019 ዓ.ም. = ህዳር የኢትዮጵያ ወር ሶስተኛ ነው፤
// የጎርጎርዮስ እኩይ = ህዳር 6 → ኖቬምበር 15 2026 (እሁድ — ከግብዣው ጋር የሚስማማ)።
// ሰዓት: 10:00 የአካባቢው (የኢትዮጵያ) ሰዓት = 16:00 (4 PM) ዓለም አቀፍ ሰዓት።
// አዲስ አበባ ሁልጊዜ UTC+3 ነው (የአሞራጅ ሰዓት መቀየር የለም)፣ ስለዚህ ቀጥታ +03:00 መጠቀም አስተማማኝ ነው።
const TARGET_DATE = new Date("2026-11-15T16:00:00+03:00");

const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const MS_DAY = 24 * MS_HOUR;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ═════════════ የመክፈቻ ኤንቨሎፕ መክፈት ═════════════ */

(function initOpener() {
  const opener = document.getElementById("opener");
  const envelope = document.getElementById("envelope");
  const openBtn = document.getElementById("openBtn");
  const invitation = document.getElementById("invitation");
  let opened = false;

  document.body.classList.add("is-locked");

  openBtn.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;
    openBtn.textContent = "በመክፈት ላይ…";

    opener.classList.add("is-opening");
    envelope.classList.add("is-open");
    burstSparkles();

    const transitionDelay = reducedMotion ? 400 : 2900;

    setTimeout(() => {
      invitation.hidden = false;
      document.body.classList.remove("is-locked");
      opener.classList.add("is-closing");
      // እንዲህ ሁለት ፍሬም መጠባበቅ ካርዱ የግባት እንቅስቃሴው (transition) እንዲሠራ ያደርጋል
      requestAnimationFrame(() => {
        requestAnimationFrame(() => document.body.classList.add("invitation-open"));
      });
      startParticles();
      startLuxSparks();
      initReveals();
    }, transitionDelay * 0.62);

    setTimeout(() => {
      opener.remove();
    }, transitionDelay);
  });
})();

/* ═════════════ የወርቅ ብልጭታ (ወይም ከዋክብት ብርሃን) ═════════════ */

function burstSparkles() {
  if (reducedMotion) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.35;
  for (let i = 0; i < 22; i++) {
    const dot = document.createElement("span");
    dot.className = "sparkle";
    const size = 3 + Math.random() * 6;
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 180;
    dot.style.width = size + "px";
    dot.style.height = size + "px";
    dot.style.left = cx + Math.cos(angle) * dist - size / 2 + "px";
    dot.style.top = cy + Math.sin(angle) * dist - size / 2 + "px";
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1100);
  }
}

/* ═════════════ የሚንሳፈፉ ወርቅ ቅንጣቶች ═════════════ */

function startParticles() {
  if (reducedMotion) return;
  let active = 0;
  const MAX = reducedMotion ? 0 : 24;

  function spawn() {
    if (document.hidden || active >= MAX) return;
    active++;
    const p = document.createElement("span");
    p.className = "particle";
    const size = 3 + Math.random() * 5;
    const duration = 9 + Math.random() * 8;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
    p.style.animationDuration = duration + "s";
    p.addEventListener("animationend", () => { p.remove(); active--; });
    document.body.appendChild(p);
  }

  spawn();
  spawn();
  const interval = setInterval(spawn, 1400);
  if (!document.getElementById("invitation")) clearInterval(interval);
}

/* ═════════════ በግብዣው ካርድ ውስጥ የሚቈጭ ብልጭታዎች ═════════════ */

function startLuxSparks() {
  if (reducedMotion) return;
  const card = document.querySelector(".invite-card");
  if (!card) return;

  setInterval(() => {
    if (document.hidden) return;
    const spark = document.createElement("span");
    spark.className = "lux-spark";
    const size = 2.5 + Math.random() * 4;
    spark.style.width = size + "px";
    spark.style.height = size + "px";
    spark.style.left = 4 + Math.random() * 92 + "%";
    spark.style.top = 2 + Math.random() * 96 + "%";
    card.appendChild(spark);
    setTimeout(() => spark.remove(), 2500);
  }, 700);
}

/* ═════════════ የቀን ቆጣሪ (ዒላማው በሰከንድ ይቀያየራል) ═════════════ */

(function initCountdown() {
  const cells = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };
  const doneEl = document.getElementById("countdownDone");
  const grid = document.getElementById("countdownGrid");
  const pad = (n) => String(n).padStart(2, "0");
  let timer = null;

  function setCell(el, value) {
    const text = pad(value);
    if (el.textContent !== text) {
      el.textContent = text;
      el.classList.remove("tick");
      void el.offsetWidth; // እንቅስቃሴው እንደገና እንዲጀምር
      el.classList.add("tick");
    }
  }

  function finish(passed) {
    if (timer) clearInterval(timer);
    grid.style.display = "none";
    doneEl.hidden = false;
    doneEl.textContent = passed
      ? "የሽምግልናችን ቀን አልፏል።"
      : "የሽምግልናችን ቀን ደርሷል!";
  }

  function update() {
    const now = Date.now();
    const diff = TARGET_DATE.getTime() - now;

    if (diff <= 0) {
      finish(now - TARGET_DATE.getTime() > MS_HOUR);
      return;
    }

    const days = Math.floor(diff / MS_DAY);
    const hours = Math.floor((diff % MS_DAY) / MS_HOUR);
    const minutes = Math.floor((diff % MS_HOUR) / MS_MINUTE);
    const seconds = Math.floor((diff % MS_MINUTE) / MS_SECOND);

    setCell(cells.days, days);
    setCell(cells.hours, hours);
    setCell(cells.minutes, minutes);
    setCell(cells.seconds, seconds);
  }

  update();
  timer = setInterval(update, MS_SECOND);

  // በሌላ ታብ ሲተውት ሲመለሱ ቆጣሪው ወዲያውኑ ይስተካከላል
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) update();
  });
})();

/* ═════════════ መንሸራተት ሲኖር መታየት (Intersection Observer) ═════════════ */

function initReveals() {
  const reveals = document.querySelectorAll(".reveal");
  const detailCards = document.querySelectorAll(".detail-card");

  detailCards.forEach((card, i) => {
    card.style.setProperty("--stagger", i * 0.12 + "s");
    card.style.setProperty("--float-delay", i * 0.9 + "s");
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}
