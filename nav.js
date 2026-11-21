/* StoonOld shared navigation dock. Add <script src="nav.js"></script> before </body> on every page. */
(() => {
  /* ===== Edit these if your file names are different ===== */
  const PAGES = { home: "index.html", schedule: "schedule.html", radio: "radio.html" };
  /* ======================================================== */

  const svg = p => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  const ITEMS = [
    { k: "home", href: PAGES.home, ar: "الرئيسية", en: "Home", ic: svg('<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>') },
    { k: "live", href: PAGES.home + "#live", ar: "مباشر", en: "Live", ic: svg('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor"/>') },
    { k: "schedule", href: PAGES.schedule, ar: "الجدول", en: "Schedule", ic: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>') },
    { k: "radio", href: PAGES.radio, ar: "الراديو", en: "Radio", ic: svg('<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8l10-5"/><circle cx="9" cy="14" r="2.5"/><path d="M14 13h4M14 16h4"/>') }
  ];

  const st = document.createElement("style");
  st.textContent =
    "body{padding-bottom:96px}#live{scroll-margin-top:80px}" +
    "#dock{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:40;display:flex;gap:4px;padding:6px;border-radius:99px;" +
    "background:var(--sf,#151833);border:1px solid var(--sb,#2a2f5e);-webkit-backdrop-filter:var(--bf,none);backdrop-filter:var(--bf,none);box-shadow:var(--sh,0 10px 30px rgba(0,0,0,.4))}" +
    "#dock a{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:99px;color:var(--mu,#a3a8cc);font:600 .95rem Cairo,sans-serif;text-decoration:none;white-space:nowrap}" +
    "#dock a:hover{color:var(--tx,#fff)}" +
    "#dock a.on{background:var(--ac,#ffc400);color:var(--acx,#1a1300)}" +
    "#dock a:focus-visible{outline:3px solid var(--ac,#ffc400);outline-offset:2px}" +
    "@media(max-width:520px){#dock a{padding:9px 12px}#dock a:not(.on) span{display:none}}";
  document.head.appendChild(st);

  const nav = document.createElement("nav");
  nav.id = "dock";
  nav.setAttribute("aria-label", "Main");
  document.body.appendChild(nav);

  const file = () => (location.pathname.split("/").pop() || PAGES.home).toLowerCase();
  const active = () => {
    const f = file();
    if (f === PAGES.schedule) return "schedule";
    if (f === PAGES.radio) return "radio";
    return location.hash === "#live" ? "live" : "home";
  };
  const onHome = () => { const a = active(); return a === "home" || a === "live"; };

  function render() {
    const lang = (document.documentElement.lang || "ar").startsWith("ar") ? "ar" : "en", a = active();
    nav.innerHTML = ITEMS.map(i => '<a href="' + i.href + '" data-k="' + i.k + '"' + (i.k === a ? ' class="on" aria-current="page"' : "") + ">" + i.ic + "<span>" + i[lang] + "</span></a>").join("");
  }

  /* On the home page, Home and Live scroll instead of reloading the page */
  nav.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a || !onHome() || (a.dataset.k !== "home" && a.dataset.k !== "live")) return;
    e.preventDefault();
    if (a.dataset.k === "live") {
      history.replaceState(null, "", location.pathname + location.search + "#live");
      (document.getElementById("live") || document.body).scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    render();
  });
  addEventListener("hashchange", render);
  /* the pages switch language by changing <html lang>, so follow it */
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  render();
})();
