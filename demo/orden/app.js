/* ================================================================
   ORDEN — demo application logic
   Fully client-side. Simulates the Orden P2P lending marketplace:
   listings, counter-offer negotiation, funding, notifications.
   ================================================================ */

(() => {
  "use strict";

  const STORAGE_KEY = "orden-demo-v2";
  const AUTH_KEY = "orden-demo-auth";
  const YOU = { name: "Jordan Demo", initials: "JD" };

  const FREQ = {
    WEEKLY: { label: "wk", perYear: 52, adverb: "weekly" },
    MONTHLY: { label: "mo", perYear: 12, adverb: "monthly" },
    QUARTERLY: { label: "qtr", perYear: 4, adverb: "quarterly" },
    YEARLY: { label: "yr", perYear: 1, adverb: "yearly" },
  };

  const PURPOSE_LABEL = {
    PERSONAL: "Personal",
    BUSINESS: "Business",
    EDUCATION: "Education",
    MEDICAL: "Medical",
    DEBT_CONSOLIDATION: "Debt consolidation",
    HOME_IMPROVEMENT: "Home improvement",
    VEHICLE: "Vehicle",
    OTHER: "Other",
  };

  const AVATAR_COLORS = ["#1e6b4e", "#b4541f", "#2a5d8f", "#7c4a8f", "#a8842c", "#4a6b8f", "#8f4a4a"];

  /* ---------------- Seed data ---------------- */

  function seedLoans() {
    const mk = (id, type, lister, purpose, principal, rate, term, freq, status, extra = {}) => ({
      id, type, lister, purpose, principal, rate, term, freq, status,
      yours: lister === YOU.name,
      counter: null,
      counterBy: null,
      interestedParty: null,
      ...extra,
    });

    return [
      mk(147, "BORROWING", "Maya Okafor", "BUSINESS", 24000, 9.25, 48, "MONTHLY", "OPEN"),
      mk(146, "LENDING", "Sam Whitfield", "PERSONAL", 8000, 7.5, 24, "MONTHLY", "OPEN"),
      mk(145, "BORROWING", "Priya Raman", "EDUCATION", 15500, 6.75, 60, "MONTHLY", "OPEN"),
      mk(144, "LENDING", "Dmitri Volkov", "BUSINESS", 50000, 11.0, 36, "QUARTERLY", "OPEN"),
      mk(143, "BORROWING", YOU.name, "VEHICLE", 18000, 8.0, 48, "MONTHLY", "COUNTER", {
        counter: { principal: 18000, rate: 9.5, term: 42, freq: "MONTHLY" },
        counterBy: "Elena Marsh",
        interestedParty: "Elena Marsh",
      }),
      mk(142, "BORROWING", "Theo Lindqvist", "MEDICAL", 6200, 5.5, 18, "MONTHLY", "OPEN"),
      mk(141, "LENDING", "Amara Diallo", "DEBT_CONSOLIDATION", 32000, 10.25, 60, "MONTHLY", "OPEN"),
      mk(140, "BORROWING", "Jonas Petrov", "HOME_IMPROVEMENT", 27500, 8.75, 36, "MONTHLY", "OPEN"),
      mk(139, "LENDING", "Celine Moreau", "PERSONAL", 12000, 6.9, 30, "MONTHLY", "OPEN"),
      mk(138, "BORROWING", "Ravi Chandra", "BUSINESS", 75000, 12.5, 84, "QUARTERLY", "OPEN"),
      mk(137, "LENDING", "Ingrid Halvorsen", "EDUCATION", 20000, 5.9, 48, "MONTHLY", "OPEN"),
      mk(136, "BORROWING", "Marcus Bell", "OTHER", 4500, 7.0, 12, "WEEKLY", "OPEN"),
      mk(135, "LENDING", "Lucia Ferreira", "VEHICLE", 22000, 8.4, 60, "MONTHLY", "FUNDED", {
        interestedParty: "Owen Gallagher", paid: 14,
      }),
      mk(134, "BORROWING", "Hana Kobayashi", "BUSINESS", 40000, 10.75, 48, "MONTHLY", "FUNDED", {
        interestedParty: "Sam Whitfield", paid: 6,
      }),
      mk(133, "BORROWING", "Elena Marsh", "PERSONAL", 9500, 7.25, 24, "MONTHLY", "REPAID", {
        interestedParty: "Celine Moreau",
      }),
      mk(132, "LENDING", "Owen Gallagher", "DEBT_CONSOLIDATION", 16000, 9.0, 36, "MONTHLY", "REPAID", {
        interestedParty: "Marcus Bell",
      }),
      mk(131, "LENDING", YOU.name, "BUSINESS", 25000, 9.75, 36, "MONTHLY", "FUNDED", {
        interestedParty: "Ravi Chandra", paid: 9,
      }),
      mk(130, "BORROWING", YOU.name, "EDUCATION", 12000, 6.5, 24, "MONTHLY", "REPAID", {
        interestedParty: "Ingrid Halvorsen",
      }),
    ];
  }

  function seedNotifications() {
    return [
      { msg: "Elena Marsh counter-offered on your vehicle loan Nº 143 — 9.5% over 42 months.", time: "2h ago", unread: true },
      { msg: "Welcome to Orden. Your account is verified and ready to trade.", time: "1d ago", unread: false },
    ];
  }

  /* ---------------- State ---------------- */

  let state = load() || { loans: seedLoans(), notifications: seedNotifications(), fundedCount: 214 };
  let filters = { type: "ALL", purpose: "ALL", status: "ACTIVE" };
  let openLoanId = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* private mode */ }
  }

  /* ---------------- Money math ---------------- */

  function payment(principal, aprPct, termMonths, freq) {
    const perYear = FREQ[freq].perYear;
    const n = Math.max(1, Math.round((termMonths / 12) * perYear));
    const r = aprPct / 100 / perYear;
    if (r === 0) return principal / n;
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }

  const fmtMoney = (v, digits = 0) =>
    "$" + v.toLocaleString("en-CA", { minimumFractionDigits: digits, maximumFractionDigits: digits });

  const fmtPayment = (loan, terms) => {
    const t = terms || loan;
    return `${fmtMoney(payment(t.principal, t.rate, t.term, t.freq), 0)}/${FREQ[t.freq].label}`;
  };

  const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarColor = (name) => AVATAR_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

  /* ---------------- DOM refs ---------------- */

  const $ = (id) => document.getElementById(id);
  const ledgerBody = $("ledgerBody");
  const drawer = $("drawer");
  const drawerScrim = $("drawerScrim");
  const modalScrim = $("modalScrim");
  const notifPanel = $("notifPanel");

  /* ---------------- Auth & routing ---------------- */

  const isAuthed = () => localStorage.getItem(AUTH_KEY) === "1";

  function showView(view) {
    $("view-landing").hidden = view !== "landing";
    $("view-login").hidden = view !== "login";
    $("view-app").hidden = view !== "app";
    document.body.classList.toggle("authed", view === "app");
  }

  function route() {
    const h = location.hash;

    // In-page anchors ("#how") and bare/empty hashes belong to the landing page.
    if (!h.startsWith("#/")) {
      showView("landing");
      if (h.length > 1) {
        const target = document.querySelector(h);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const name = h.slice(2);
    if (name === "login") {
      if (isAuthed()) { location.hash = "#/market"; return; }
      showView("login");
    } else if (name === "market" || name === "ledger") {
      if (!isAuthed()) { location.hash = "#/login"; return; }
      showView("app");
      $("market").hidden = name !== "market";
      $("myledger").hidden = name !== "ledger";
      document.querySelectorAll(".nav-app[data-route]").forEach((a) =>
        a.classList.toggle("active", a.dataset.route === name));
      if (name === "ledger") renderMyLedger();
    } else {
      showView("landing");
    }
    window.scrollTo(0, 0);
  }

  function wireAuth() {
    $("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = $("loginUser").value.trim().toLowerCase() === "admin" && $("loginPass").value === "password";
      if (!ok) {
        $("loginError").hidden = false;
        const card = document.querySelector(".login-card");
        card.classList.remove("shake");
        void card.offsetWidth; // restart animation
        card.classList.add("shake");
        return;
      }
      $("loginError").hidden = true;
      $("loginPass").value = "";
      localStorage.setItem(AUTH_KEY, "1");
      location.hash = "#/market";
      toast(`Welcome back, <strong>${YOU.name}</strong>. The book is open.`);
    });

    $("userChip").addEventListener("click", () => { location.hash = "#/ledger"; });

    $("signOutBtn").addEventListener("click", () => {
      localStorage.removeItem(AUTH_KEY);
      location.hash = "#/";
      toast("Signed out. The ledger keeps your place.");
    });

    window.addEventListener("hashchange", route);
  }

  /* ---------------- Ledger rendering ---------------- */

  const STATUS_META = {
    OPEN: { cls: "open", label: "Open" },
    COUNTER: { cls: "counter", label: "Counter" },
    FUNDED: { cls: "funded", label: "Funded" },
    REPAID: { cls: "repaid", label: "Repaid" },
  };

  function visibleLoans() {
    return state.loans.filter((l) => {
      if (filters.type !== "ALL" && l.type !== filters.type) return false;
      if (filters.purpose !== "ALL" && l.purpose !== filters.purpose) return false;
      if (filters.status === "ACTIVE") return l.status === "OPEN" || l.status === "COUNTER";
      if (filters.status !== "ALL" && l.status !== filters.status) return false;
      return true;
    });
  }

  function renderLedger(animate = false) {
    const loans = visibleLoans();
    ledgerBody.innerHTML = "";
    ledgerBody.classList.toggle("animate", animate);
    $("ledgerEmpty").hidden = loans.length > 0;

    loans.forEach((loan, i) => {
      const tr = document.createElement("tr");
      tr.style.setProperty("--i", Math.min(i, 14));
      if (loan.yours) tr.classList.add("is-yours");
      const side = loan.type === "BORROWING"
        ? '<span class="side-tag borrow">BORROW</span>'
        : '<span class="side-tag lend">LEND</span>';
      const st = STATUS_META[loan.status];
      tr.innerHTML = `
        <td class="cell-id">#${loan.id}</td>
        <td>${side}</td>
        <td>${PURPOSE_LABEL[loan.purpose]}</td>
        <td class="num cell-principal">${fmtMoney(loan.principal)}</td>
        <td class="num cell-rate">${loan.rate.toFixed(2)}%</td>
        <td class="num cell-term">${loan.term} mo</td>
        <td class="num cell-payment">${fmtPayment(loan)}</td>
        <td><span class="cell-lister">
          <span class="lister-avatar" style="background:${avatarColor(loan.lister)}">${initials(loan.lister)}</span>
          ${loan.yours ? `${YOU.name} <span class="you-tag">YOU</span>` : loan.lister}
        </span></td>
        <td><span class="stamp ${st.cls}">${st.label}</span></td>`;
      tr.addEventListener("click", () => openDrawer(loan.id));
      ledgerBody.appendChild(tr);
    });
  }

  /* ---------------- Stats & ticker ---------------- */

  function animateValue(el, target, fmt, duration = 1200) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function renderStats(animate = false) {
    const active = state.loans.filter((l) => l.status === "OPEN" || l.status === "COUNTER");
    const volume = active.reduce((s, l) => s + l.principal, 0);
    const rates = active.map((l) => l.rate).sort((a, b) => a - b);
    const median = rates.length ? rates[Math.floor(rates.length / 2)] : 0;
    const funded = state.fundedCount + state.loans.filter((l) => l.status === "FUNDED" || l.status === "REPAID").length;

    if (animate) {
      animateValue($("statVolume"), volume, (v) => fmtMoney(Math.round(v)));
      animateValue($("statOpen"), active.length, (v) => Math.round(v).toString());
      animateValue($("statRate"), median, (v) => v.toFixed(2) + "%");
      animateValue($("statFunded"), funded, (v) => Math.round(v).toString());
    } else {
      $("statVolume").textContent = fmtMoney(volume);
      $("statOpen").textContent = active.length;
      $("statRate").textContent = median.toFixed(2) + "%";
      $("statFunded").textContent = funded;
    }
  }

  function renderTicker() {
    const items = state.loans
      .filter((l) => l.status === "OPEN" || l.status === "COUNTER")
      .slice(0, 12)
      .map((l) => {
        const dir = l.type === "BORROWING" ? "down" : "up";
        const arrow = l.type === "BORROWING" ? "▾" : "▴";
        return `<span>Nº${l.id} ${PURPOSE_LABEL[l.purpose].toUpperCase()} ${fmtMoney(l.principal)} <span class="${dir}">${arrow} ${l.rate.toFixed(2)}%</span></span>`;
      });
    // duplicate for seamless loop
    $("tickerTrack").innerHTML = items.join("") + items.join("");
  }

  /* ---------------- My Ledger (profile / portfolio) ---------------- */

  const isBorrower = (l) =>
    (l.type === "BORROWING" && l.lister === YOU.name) ||
    (l.type === "LENDING" && l.interestedParty === YOU.name);

  function renderMyLedger() {
    const mine = state.loans.filter((l) => l.lister === YOU.name || l.interestedParty === YOU.name);
    const listings = mine.filter((l) => l.lister === YOU.name && (l.status === "OPEN" || l.status === "COUNTER"));
    const deals = mine.filter((l) => l.status === "FUNDED" || l.status === "REPAID");
    const funded = deals.filter((l) => l.status === "FUNDED");
    const lent = funded.filter((l) => !isBorrower(l)).reduce((s, l) => s + l.principal, 0);
    const borrowed = funded.filter((l) => isBorrower(l)).reduce((s, l) => s + l.principal, 0);

    $("mlStats").innerHTML = [
      [listings.length, "On the book"],
      [funded.length, "Active deals"],
      [fmtMoney(lent), "Lent out"],
      [fmtMoney(borrowed), "Borrowed"],
    ].map(([v, label]) =>
      `<div class="stat"><span class="stat-value mono">${v}</span><span class="stat-label">${label}</span></div>`
    ).join('<div class="stat-rule"></div>');

    $("mlListings").innerHTML = listings.length
      ? listings.map((l) => {
          const st = STATUS_META[l.status];
          return `<div class="ml-card" data-id="${l.id}">
            <div class="ml-card-head">
              <span class="side-tag ${l.type === "BORROWING" ? "borrow" : "lend"}">${l.type === "BORROWING" ? "BORROW" : "LEND"}</span>
              <span class="cell-id mono">Nº ${l.id}</span>
              <span class="stamp ${st.cls}">${st.label}</span>
            </div>
            <p class="ml-terms">${fmtMoney(l.principal)} · ${l.rate.toFixed(2)}% · ${l.term} mo</p>
            <p class="ml-sub">${PURPOSE_LABEL[l.purpose]} · ${fmtPayment(l)}${l.status === "COUNTER" && l.counterBy !== YOU.name ? ` · <strong>counter from ${l.counterBy}</strong>` : ""}</p>
          </div>`;
        }).join("")
      : `<p class="empty-note">Nothing listed right now — post something to the book.</p>`;

    $("mlDeals").innerHTML = deals.length
      ? deals.map((l) => {
          const total = Math.max(1, Math.round((l.term / 12) * FREQ[l.freq].perYear));
          const paid = l.status === "REPAID" ? total : Math.min(l.paid || 0, total);
          const pct = Math.round((paid / total) * 100);
          const other = l.lister === YOU.name ? l.interestedParty : l.lister;
          const st = STATUS_META[l.status];
          return `<div class="ml-card" data-id="${l.id}">
            <div class="ml-card-head">
              <span class="side-tag ${isBorrower(l) ? "borrow" : "lend"}">${isBorrower(l) ? "YOU BORROW" : "YOU LEND"}</span>
              <span class="cell-id mono">Nº ${l.id}</span>
              <span class="stamp ${st.cls}">${st.label}</span>
            </div>
            <p class="ml-terms">${fmtMoney(l.principal)} · ${l.rate.toFixed(2)}% · ${l.term} mo</p>
            <p class="ml-sub">with ${other || "—"} · ${fmtPayment(l)}</p>
            <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="ml-foot">
              <span>${paid} OF ${total} PAYMENTS</span>
              <span>${l.status === "REPAID" ? "CLOSED" : paid === 0 ? "FIRST IN " + ((l.id % 21) + 3) + " DAYS" : "NEXT IN " + ((l.id % 21) + 3) + " DAYS"}</span>
            </div>
          </div>`;
        }).join("")
      : `<p class="empty-note">No deals yet — take someone's terms or accept a counter to strike one.</p>`;

    document.querySelectorAll("#myledger .ml-card[data-id]").forEach((card) =>
      card.addEventListener("click", () => openDrawer(+card.dataset.id)));
  }

  /* ---------------- Drawer (loan detail + negotiation) ---------------- */

  function openDrawer(id) {
    openLoanId = id;
    renderDrawer();
    drawerScrim.hidden = false;
    requestAnimationFrame(() => {
      drawerScrim.classList.add("show");
      drawer.classList.add("show");
    });
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.remove("show");
    drawerScrim.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
    setTimeout(() => { drawerScrim.hidden = true; }, 350);
    openLoanId = null;
  }

  function termsGrid(loan, t) {
    return `
      <div class="terms-grid">
        <div class="term-cell"><span class="term-label">Principal</span><span class="term-value">${fmtMoney(t.principal)}</span></div>
        <div class="term-cell"><span class="term-label">Rate (APR)</span><span class="term-value">${t.rate.toFixed(2)}%</span></div>
        <div class="term-cell"><span class="term-label">Term</span><span class="term-value">${t.term} <small>months</small></span></div>
        <div class="term-cell"><span class="term-label">Cadence</span><span class="term-value" style="text-transform:capitalize">${FREQ[t.freq].adverb}</span></div>
        <div class="term-cell"><span class="term-label">Est. payment</span><span class="term-value">${fmtPayment(loan, t)}</span></div>
        <div class="term-cell"><span class="term-label">Total repaid</span><span class="term-value">${fmtMoney(payment(t.principal, t.rate, t.term, t.freq) * Math.round((t.term / 12) * FREQ[t.freq].perYear))}</span></div>
      </div>`;
  }

  function partiesRow(loan) {
    const borrower = loan.type === "BORROWING" ? loan.lister : loan.interestedParty;
    const lender = loan.type === "LENDING" ? loan.lister : loan.interestedParty;
    const cell = (role, name) => name
      ? `<div class="party">
           <span class="lister-avatar" style="background:${avatarColor(name)}">${initials(name)}</span>
           <span><span class="party-role">${role}</span><span class="party-name">${name === YOU.name ? name + " (you)" : name}</span></span>
         </div>`
      : `<div class="party"><span><span class="party-role">${role}</span><span class="party-name" style="color:var(--ink-faint);font-style:italic">Awaiting party</span></span></div>`;
    return `<div class="parties">${cell("Borrower", borrower)}<span class="party-arrow">⇄</span>${cell("Lender", lender)}</div>`;
  }

  function renderDrawer() {
    const loan = state.loans.find((l) => l.id === openLoanId);
    if (!loan) return;

    $("drawerId").textContent = `LISTING Nº ${loan.id} · ${loan.type === "BORROWING" ? "BORROW REQUEST" : "LENDING OFFER"}`;
    $("drawerTitle").textContent = `${fmtMoney(loan.principal)} · ${PURPOSE_LABEL[loan.purpose]}`;

    let html = partiesRow(loan);
    html += `<p class="drawer-section-title">Listed terms</p>`;
    html += termsGrid(loan, loan);

    if (loan.status === "FUNDED" || loan.status === "REPAID") {
      html = `
        <div class="deal-banner">
          <span class="deal-stamp">${loan.status === "FUNDED" ? "Deal struck." : "Fully repaid."}</span>
          <p>${loan.status === "FUNDED"
            ? "Terms agreed and funds transferred. Repayment schedule is live."
            : "Every payment made on time. This ledger entry is closed."}</p>
        </div>` + html;
    } else if (loan.status === "COUNTER" && loan.counter) {
      const c = loan.counter;
      const line = (label, was, now, fmt) => was === now
        ? `<div class="counter-line"><span>${label}</span><span>${fmt(now)}</span></div>`
        : `<div class="counter-line"><span>${label}</span><span><span class="was">${fmt(was)}</span>${fmt(now)}</span></div>`;
      html += `<p class="drawer-section-title">Counter-offer on the table</p>
        <div class="counter-block">
          <div class="counter-block-head"><span>From ${loan.counterBy}</span><span class="mono">PENDING</span></div>
          ${line("Principal", loan.principal, c.principal, (v) => fmtMoney(v))}
          ${line("Rate", loan.rate, c.rate, (v) => v.toFixed(2) + "%")}
          ${line("Term", loan.term, c.term, (v) => v + " mo")}
          <div class="counter-line"><span>New payment</span><span>${fmtPayment(loan, c)}</span></div>
          ${loan.yours ? `
          <div class="counter-actions">
            <button class="btn btn-lend" id="acceptCounter">Accept &amp; fund</button>
            <button class="btn btn-ghost" id="declineCounter">Decline</button>
          </div>` : ""}
        </div>`;
    }

    // Negotiation form: only on other people's open listings
    if (!loan.yours && loan.status === "OPEN") {
      const youAre = loan.type === "BORROWING" ? "lend" : "borrow";
      html += `<p class="drawer-section-title">Make it yours</p>
        <p style="font-size:0.88rem;color:var(--ink-soft);margin-bottom:1.1rem">
          You would be the <strong>${youAre === "lend" ? "lender" : "borrower"}</strong> on this deal.
          Take the listed terms as-is, or slide a counter across the table.
        </p>
        <div class="nego-field">
          <div class="nego-label"><span>Rate</span><span class="mono" id="negoRateEcho">${loan.rate.toFixed(2)}%</span></div>
          <input type="range" id="negoRate" min="1" max="24" step="0.25" value="${loan.rate}" />
        </div>
        <div class="nego-field">
          <div class="nego-label"><span>Term</span><span class="mono" id="negoTermEcho">${loan.term} mo</span></div>
          <input type="range" id="negoTerm" min="3" max="120" step="3" value="${loan.term}" />
        </div>
        <div class="nego-field">
          <div class="nego-label"><span>Principal</span><span class="mono" id="negoPrincipalEcho">${fmtMoney(loan.principal)}</span></div>
          <input type="range" id="negoPrincipal" min="500" max="100000" step="500" value="${loan.principal}" />
        </div>
        <div class="drawer-payment">
          <span>Payment at these terms</span>
          <span class="mono payment-figure" id="negoPayment">${fmtPayment(loan)}</span>
        </div>
        <div class="counter-actions">
          <button class="btn ${youAre === "lend" ? "btn-lend" : "btn-borrow"}" id="takeDeal">Take listed terms</button>
          <button class="btn btn-ghost" id="sendCounter">Send counter</button>
        </div>`;
    }

    if (loan.yours && loan.status === "OPEN") {
      html += `<p class="drawer-section-title">Your listing</p>
        <p style="font-size:0.88rem;color:var(--ink-soft)">
          This listing is live on the book. You'll be notified the moment someone
          takes the terms or slides a counter-offer across the table.
        </p>`;
    }

    $("drawerBody").innerHTML = html;
    wireDrawerActions(loan);
  }

  function wireDrawerActions(loan) {
    const rate = $("negoRate"), term = $("negoTerm"), principal = $("negoPrincipal");

    if (rate && term && principal) {
      const update = () => {
        $("negoRateEcho").textContent = parseFloat(rate.value).toFixed(2) + "%";
        $("negoTermEcho").textContent = term.value + " mo";
        $("negoPrincipalEcho").textContent = fmtMoney(+principal.value);
        $("negoPayment").textContent = fmtPayment(loan, {
          principal: +principal.value, rate: +rate.value, term: +term.value, freq: loan.freq,
        });
      };
      [rate, term, principal].forEach((el) => el.addEventListener("input", update));

      $("takeDeal").addEventListener("click", () => {
        loan.status = "FUNDED";
        loan.interestedParty = YOU.name;
        notify(`Deal struck on Nº ${loan.id} — you and ${loan.lister} are on the ledger.`);
        toast(`Deal struck. <span class="mono">Nº ${loan.id}</span> is funded.`);
        commit();
        renderDrawer();
      });

      $("sendCounter").addEventListener("click", () => {
        const changed = +rate.value !== loan.rate || +term.value !== loan.term || +principal.value !== loan.principal;
        if (!changed) { toast("Adjust at least one term to counter — or just take the deal."); return; }
        loan.status = "COUNTER";
        loan.counter = { principal: +principal.value, rate: +rate.value, term: +term.value, freq: loan.freq };
        loan.counterBy = YOU.name;
        loan.interestedParty = YOU.name;
        notify(`You countered ${loan.lister} on Nº ${loan.id} at ${(+rate.value).toFixed(2)}% over ${term.value} months.`);
        toast(`Counter sent to ${loan.lister}. <span class="mono">${(+rate.value).toFixed(2)}% · ${term.value}mo</span>`);
        commit();
        renderDrawer();
        // The other side mulls it over, then accepts.
        setTimeout(() => {
          if (loan.status === "COUNTER" && loan.counterBy === YOU.name) {
            loan.status = "FUNDED";
            loan.principal = loan.counter.principal;
            loan.rate = loan.counter.rate;
            loan.term = loan.counter.term;
            loan.counter = null;
            notify(`${loan.lister} accepted your counter on Nº ${loan.id}. The deal is funded.`);
            toast(`${loan.lister} <strong>accepted</strong> your counter on <span class="mono">Nº ${loan.id}</span>.`);
            commit();
            if (openLoanId === loan.id) renderDrawer();
          }
        }, 6000 + Math.random() * 4000);
      });
    }

    const accept = $("acceptCounter");
    if (accept) {
      accept.addEventListener("click", () => {
        loan.principal = loan.counter.principal;
        loan.rate = loan.counter.rate;
        loan.term = loan.counter.term;
        loan.status = "FUNDED";
        loan.counter = null;
        notify(`You accepted ${loan.counterBy}'s counter on Nº ${loan.id}. The deal is funded.`);
        toast(`Deal struck with ${loan.counterBy}. <span class="mono">Nº ${loan.id}</span> is funded.`);
        loan.counterBy = null;
        commit();
        renderDrawer();
      });
      $("declineCounter").addEventListener("click", () => {
        const from = loan.counterBy;
        loan.status = "OPEN";
        loan.counter = null;
        loan.counterBy = null;
        loan.interestedParty = null;
        notify(`You declined ${from}'s counter on Nº ${loan.id}. The listing is back on the book.`);
        toast(`Counter declined. <span class="mono">Nº ${loan.id}</span> is open again.`);
        commit();
        renderDrawer();
      });
    }
  }

  /* ---------------- New listing modal ---------------- */

  let newListingType = "BORROWING";

  function openModal() {
    modalScrim.hidden = false;
    requestAnimationFrame(() => modalScrim.classList.add("show"));
    updateFormEchoes();
  }

  function closeModal() {
    modalScrim.classList.remove("show");
    setTimeout(() => { modalScrim.hidden = true; }, 280);
  }

  function updateFormEchoes() {
    const p = +$("fPrincipal").value, r = +$("fRate").value, t = +$("fTerm").value, f = $("fFreq").value;
    $("echoPrincipal").textContent = fmtMoney(p);
    $("echoRate").textContent = r.toFixed(2) + "% APR";
    $("echoTerm").textContent = t + " months";
    $("previewPayment").textContent = `${fmtMoney(payment(p, r, t, f))}/${FREQ[f].label}`;
  }

  function wireModal() {
    $("newListingBtn").addEventListener("click", openModal);
    $("modalClose").addEventListener("click", closeModal);
    modalScrim.addEventListener("click", (e) => { if (e.target === modalScrim) closeModal(); });

    $("sideToggle").querySelectorAll(".side-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        newListingType = btn.dataset.type;
        $("sideToggle").querySelectorAll(".side-btn").forEach((b) => b.classList.toggle("active", b === btn));
      });
    });

    ["fPrincipal", "fRate", "fTerm"].forEach((id) => $(id).addEventListener("input", updateFormEchoes));
    $("fFreq").addEventListener("change", updateFormEchoes);

    $("listingForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const id = Math.max(...state.loans.map((l) => l.id)) + 1;
      const loan = {
        id,
        type: newListingType,
        lister: YOU.name,
        yours: true,
        purpose: $("fPurpose").value,
        principal: +$("fPrincipal").value,
        rate: +$("fRate").value,
        term: +$("fTerm").value,
        freq: $("fFreq").value,
        status: "OPEN",
        counter: null,
        counterBy: null,
        interestedParty: null,
      };
      state.loans.unshift(loan);
      notify(`Your ${newListingType === "BORROWING" ? "borrow request" : "lending offer"} Nº ${id} is live on the book.`);
      toast(`Listed. <span class="mono">Nº ${id}</span> is on the book.`);
      commit();
      closeModal();
      scheduleCounterOnYourListing(loan);
    });
  }

  /* After you post a listing, a market participant comes along and counters. */
  function scheduleCounterOnYourListing(loan) {
    const actors = ["Maya Okafor", "Dmitri Volkov", "Ingrid Halvorsen", "Theo Lindqvist", "Amara Diallo"];
    const actor = actors[Math.floor(Math.random() * actors.length)];
    setTimeout(() => {
      if (loan.status !== "OPEN") return;
      const bump = loan.type === "BORROWING" ? 1 : -1; // counter nudges rate against you
      loan.status = "COUNTER";
      loan.counter = {
        principal: loan.principal,
        rate: Math.max(1, Math.round((loan.rate + bump * (0.5 + Math.random() * 1.5)) * 4) / 4),
        term: loan.term,
        freq: loan.freq,
      };
      loan.counterBy = actor;
      loan.interestedParty = actor;
      notify(`${actor} counter-offered on your listing Nº ${loan.id} — ${loan.counter.rate.toFixed(2)}% APR.`);
      toast(`${actor} sent a <strong>counter</strong> on <span class="mono">Nº ${loan.id}</span>.`);
      commit();
      if (openLoanId === loan.id) renderDrawer();
    }, 9000 + Math.random() * 6000);
  }

  /* ---------------- Notifications & toasts ---------------- */

  function notify(msg) {
    state.notifications.unshift({ msg, time: "just now", unread: true });
    state.notifications = state.notifications.slice(0, 20);
    renderNotifs();
  }

  function renderNotifs() {
    const list = $("notifList");
    if (!state.notifications.length) {
      list.innerHTML = `<li class="notif-empty">All quiet on the book.</li>`;
    } else {
      list.innerHTML = state.notifications
        .map((n) => `<li class="${n.unread ? "unread" : ""}"><span class="notif-icon"></span><span>${n.msg}<span class="notif-time">${n.time}</span></span></li>`)
        .join("");
    }
    $("bellDot").hidden = !state.notifications.some((n) => n.unread);
  }

  function wireNotifs() {
    $("bellBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      notifPanel.hidden = !notifPanel.hidden;
    });
    $("notifClear").addEventListener("click", () => {
      state.notifications.forEach((n) => (n.unread = false));
      save();
      renderNotifs();
    });
    document.addEventListener("click", (e) => {
      if (!notifPanel.hidden && !notifPanel.contains(e.target)) notifPanel.hidden = true;
    });
  }

  function toast(html) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = html;
    $("toasts").appendChild(el);
    setTimeout(() => el.remove(), 3900);
  }

  /* ---------------- Ambient market activity ---------------- */

  function ambientActivity() {
    const events = [
      () => {
        const open = state.loans.filter((l) => l.status === "OPEN" && !l.yours);
        if (!open.length) return null;
        const loan = open[Math.floor(Math.random() * open.length)];
        const takers = ["Noah Fitzgerald", "Zara Ahmadi", "Felix Braun", "Imani Walker"]
          .filter((n) => n !== loan.lister);
        const taker = takers[Math.floor(Math.random() * takers.length)];
        loan.status = "FUNDED";
        loan.interestedParty = taker;
        return `${taker} funded <span class="mono">Nº ${loan.id}</span> — ${fmtMoney(loan.principal)} at ${loan.rate.toFixed(2)}%.`;
      },
      () => {
        const names = ["Aisha Bakker", "Leo Andersson", "Nina Rossi", "Kwame Mensah", "Sofia Herrera"];
        const purposes = Object.keys(PURPOSE_LABEL);
        const id = Math.max(...state.loans.map((l) => l.id)) + 1;
        const type = Math.random() > 0.5 ? "BORROWING" : "LENDING";
        state.loans.unshift({
          id, type,
          lister: names[Math.floor(Math.random() * names.length)],
          yours: false,
          purpose: purposes[Math.floor(Math.random() * purposes.length)],
          principal: (4 + Math.floor(Math.random() * 60)) * 500,
          rate: Math.round((4 + Math.random() * 10) * 4) / 4,
          term: (1 + Math.floor(Math.random() * 20)) * 6,
          freq: "MONTHLY",
          status: "OPEN",
          counter: null, counterBy: null, interestedParty: null,
        });
        const loan = state.loans[0];
        return `New on the book: <span class="mono">Nº ${loan.id}</span> ${loan.type === "BORROWING" ? "borrow request" : "lending offer"} for ${fmtMoney(loan.principal)}.`;
      },
    ];

    const tick = () => {
      const msg = events[Math.floor(Math.random() * events.length)]();
      if (msg) {
        // Only surface ambient chatter inside the app, not on the landing/login views.
        if (document.body.classList.contains("authed")) toast(msg);
        commit();
      }
      setTimeout(tick, 28000 + Math.random() * 22000);
    };
    setTimeout(tick, 18000);
  }

  /* ---------------- Filters & misc wiring ---------------- */

  function wireFilters() {
    $("typeTabs").querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        filters.type = tab.dataset.type;
        $("typeTabs").querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
        renderLedger(true);
      });
    });
    $("purposeFilter").addEventListener("change", (e) => { filters.purpose = e.target.value; renderLedger(true); });
    $("statusFilter").addEventListener("change", (e) => { filters.status = e.target.value; renderLedger(true); });
  }

  function commit() {
    save();
    renderLedger();
    renderStats();
    renderTicker();
    renderNotifs();
    if (!$("myledger").hidden) renderMyLedger();
  }

  /* ---------------- Init ---------------- */

  function init() {
    $("marketDate").textContent = new Date().toLocaleDateString("en-CA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }).toUpperCase();

    $("drawerClose").addEventListener("click", closeDrawer);
    drawerScrim.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        closeModal();
        notifPanel.hidden = true;
      }
    });

    $("resetBtn").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = { loans: seedLoans(), notifications: seedNotifications(), fundedCount: 214 };
      commit();
      toast("Demo data reset to opening bell.");
    });

    wireFilters();
    wireModal();
    wireNotifs();
    wireAuth();

    route();
    renderLedger(true);
    renderStats(true);
    renderTicker();
    renderNotifs();
    ambientActivity();
  }

  init();
})();
