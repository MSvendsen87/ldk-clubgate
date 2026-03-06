(function () {
  console.log("[CLUBGATE v10] LOADED");

  /* ------------------------------------------------ */
  /* KONFIG */
  /* ------------------------------------------------ */

  var ALLOWED_PATH = "/sider/klubbkveld-lyngdal-dart";

  var ALLOWED_GROUPS = [
    "dartklubb",
    "frisbeeklubb",
    "ansatte"
  ];

  var WORKER_BASE = "https://cold-shadow-36dc.post-cd6.workers.dev";
  var MEMBER_API = WORKER_BASE + "/club-members";

  var PRODUCT_ID = "1322";
  var PRODUCT_SETS = "1318";
  var EVENT_ID = "9847005";

  var API_PRODUCT = WORKER_BASE + "/products/" + PRODUCT_ID;

  var LOGIN_URL = "/customer/login";
  var CART_URL = "/cart/index";
  var CONTACT_EMAIL = "post@golfkongen.no";

  var CLUB_TITLE = "Klubbkveld – Lyngdal Dartklubb";
  var CLUB_TIME = "Torsdager 19:00–22:00";
  var CLUB_PRICE = "50 kr per person";
  var CLUB_INFO = "Velg ønsket torsdag og legg plassen i handlekurven. Kun datoer med ledige plasser vises.";

  /* Logo lagt inn direkte som data-URL */
  var CLUB_LOGO =
    "data:image/jpeg;base64,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";

  /* ------------------------------------------------ */
  /* PATH CHECK */
  /* ------------------------------------------------ */

  var path = String(location.pathname || "");
  while (path.length && path.charAt(path.length - 1) === "/" && path !== "/") {
    path = path.slice(0, -1);
  }
  if (path !== ALLOWED_PATH) return;

  var root = document.getElementById("gk-clubgate");
  if (!root) return;

  /* ------------------------------------------------ */
  /* CSS */
  /* ------------------------------------------------ */

  (function cssOnce() {
    if (document.getElementById("gk-clubgate-css-v10")) return;

    var css =
      ":root{" +
      "--gk-bg:#0d0d0d;" +
      "--gk-card:#171717;" +
      "--gk-card2:#101010;" +
      "--gk-soft:#1f1f1f;" +
      "--gk-line:rgba(255,255,255,.10);" +
      "--gk-text:rgba(255,255,255,.94);" +
      "--gk-muted:rgba(255,255,255,.72);" +
      "--gk-ac:#2bd18b;" +
      "--gk-ac2:#7dffb8;" +
      "--gk-gold:#f0c14b;" +
      "}" +

      "#gk-clubgate{" +
      "max-width:980px;" +
      "margin:0 auto;" +
      "padding:12px;" +
      "color:var(--gk-text);" +
      "}" +

      ".gk-box{" +
      "border:1px solid var(--gk-line);" +
      "background:linear-gradient(180deg,var(--gk-card),var(--gk-card2));" +
      "border-radius:22px;" +
      "padding:14px;" +
      "box-shadow:0 18px 50px rgba(0,0,0,.35);" +
      "}" +

      ".gk-topcard{" +
      "position:relative;" +
      "overflow:hidden;" +
      "padding:16px;" +
      "border:1px solid rgba(255,255,255,.10);" +
      "border-radius:20px;" +
      "background:radial-gradient(circle at top right, rgba(43,209,139,.12), transparent 42%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));" +
      "}" +

      ".gk-topgrid{" +
      "display:grid;" +
      "grid-template-columns:1fr;" +
      "gap:14px;" +
      "align-items:center;" +
      "}" +

      ".gk-logo-wrap{" +
      "display:flex;" +
      "justify-content:center;" +
      "}" +

      ".gk-logo{" +
      "width:112px;" +
      "height:112px;" +
      "object-fit:contain;" +
      "border-radius:18px;" +
      "background:#fff;" +
      "padding:8px;" +
      "box-shadow:0 10px 24px rgba(0,0,0,.28);" +
      "}" +

      ".gk-toptext{" +
      "display:flex;" +
      "flex-direction:column;" +
      "gap:10px;" +
      "min-width:0;" +
      "}" +

      ".gk-h{" +
      "font-weight:900;" +
      "font-size:24px;" +
      "line-height:1.1;" +
      "margin:0;" +
      "}" +

      ".gk-p{" +
      "margin:0;" +
      "color:var(--gk-muted);" +
      "line-height:1.45;" +
      "font-size:14px;" +
      "}" +

      ".gk-meta{" +
      "display:flex;" +
      "flex-wrap:wrap;" +
      "gap:8px;" +
      "}" +

      ".gk-chip{" +
      "display:inline-flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "min-height:36px;" +
      "padding:8px 12px;" +
      "border-radius:999px;" +
      "border:1px solid rgba(255,255,255,.10);" +
      "background:rgba(255,255,255,.05);" +
      "font-size:13px;" +
      "font-weight:800;" +
      "color:var(--gk-text);" +
      "}" +

      ".gk-chip.price{" +
      "border-color:rgba(240,193,75,.35);" +
      "background:linear-gradient(135deg, rgba(240,193,75,.18), rgba(240,193,75,.06));" +
      "color:#ffe29b;" +
      "}" +

      ".gk-top-actions{" +
      "display:flex;" +
      "flex-wrap:wrap;" +
      "gap:10px;" +
      "margin-top:2px;" +
      "}" +

      ".gk-btn{" +
      "display:inline-flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "gap:8px;" +
      "min-height:46px;" +
      "padding:12px 16px;" +
      "border-radius:14px;" +
      "border:1px solid rgba(255,255,255,.16);" +
      "background:rgba(255,255,255,.06);" +
      "color:var(--gk-text);" +
      "text-decoration:none;" +
      "font-weight:900;" +
      "cursor:pointer;" +
      "transition:transform .08s ease, opacity .15s ease;" +
      "}" +

      ".gk-btn.ok{" +
      "border-color:rgba(43,209,139,.55);" +
      "background:linear-gradient(135deg, rgba(43,209,139,.18), rgba(125,255,184,.08));" +
      "}" +

      ".gk-btn.block{" +
      "width:100%;" +
      "}" +

      ".gk-btn:active{transform:scale(.99)}" +
      ".gk-btn[disabled]{opacity:.72;cursor:default}" +

      ".gk-note{" +
      "margin-top:10px;" +
      "font-size:12px;" +
      "color:var(--gk-muted);" +
      "line-height:1.4;" +
      "}" +

      ".gk-row{" +
      "margin-top:14px;" +
      "}" +

      ".gk-section-head{" +
      "display:flex;" +
      "flex-direction:column;" +
      "gap:6px;" +
      "margin-bottom:10px;" +
      "}" +

      ".gk-section-title{" +
      "font-size:16px;" +
      "font-weight:900;" +
      "margin:0;" +
      "}" +

      ".gk-sets{" +
      "display:flex;" +
      "align-items:center;" +
      "justify-content:space-between;" +
      "gap:12px;" +
      "flex-wrap:wrap;" +
      "padding:12px;" +
      "border:1px solid var(--gk-line);" +
      "border-radius:16px;" +
      "background:rgba(255,255,255,.04);" +
      "}" +

      ".gk-sets-text{" +
      "flex:1 1 180px;" +
      "min-width:0;" +
      "}" +

      ".gk-sets-title{" +
      "font-weight:900;" +
      "font-size:15px;" +
      "margin:0 0 4px 0;" +
      "}" +

      ".gk-sets-sub{" +
      "font-size:12px;" +
      "color:var(--gk-muted);" +
      "line-height:1.35;" +
      "margin:0;" +
      "}" +

      ".gk-sets-ctrl{" +
      "display:flex;" +
      "align-items:center;" +
      "gap:10px;" +
      "margin-left:auto;" +
      "}" +

      ".gk-sets-btn{" +
      "width:42px;" +
      "height:42px;" +
      "border-radius:13px;" +
      "border:1px solid rgba(255,255,255,.18);" +
      "background:rgba(255,255,255,.06);" +
      "color:var(--gk-text);" +
      "font-weight:900;" +
      "font-size:18px;" +
      "cursor:pointer;" +
      "}" +

      ".gk-sets-val{" +
      "min-width:26px;" +
      "text-align:center;" +
      "font-weight:900;" +
      "font-size:18px;" +
      "}" +

      ".gk-list{" +
      "display:flex;" +
      "flex-direction:column;" +
      "gap:12px;" +
      "margin-top:12px;" +
      "}" +

      ".gk-card{" +
      "border:1px solid var(--gk-line);" +
      "border-radius:18px;" +
      "padding:14px;" +
      "background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));" +
      "display:flex;" +
      "flex-direction:column;" +
      "gap:12px;" +
      "}" +

      ".gk-card-head{" +
      "display:flex;" +
      "flex-direction:column;" +
      "gap:8px;" +
      "}" +

      ".gk-card-title{" +
      "font-weight:900;" +
      "font-size:18px;" +
      "line-height:1.15;" +
      "}" +

      ".gk-card-meta{" +
      "display:flex;" +
      "flex-wrap:wrap;" +
      "gap:8px;" +
      "}" +

      ".gk-mini{" +
      "display:inline-flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "padding:8px 10px;" +
      "border-radius:12px;" +
      "background:rgba(255,255,255,.05);" +
      "border:1px solid rgba(255,255,255,.08);" +
      "font-size:12px;" +
      "font-weight:800;" +
      "color:var(--gk-text);" +
      "}" +

      ".gk-mini.price{" +
      "border-color:rgba(240,193,75,.30);" +
      "background:linear-gradient(135deg, rgba(240,193,75,.16), rgba(240,193,75,.06));" +
      "color:#ffe29b;" +
      "}" +

      ".gk-empty{" +
      "padding:14px;" +
      "border:1px solid var(--gk-line);" +
      "border-radius:16px;" +
      "background:rgba(255,255,255,.03);" +
      "color:var(--gk-muted);" +
      "}" +

      "@media (min-width: 760px){" +
      "#gk-clubgate{padding:16px}" +
      ".gk-box{padding:18px}" +
      ".gk-topcard{padding:20px}" +
      ".gk-topgrid{grid-template-columns:124px 1fr}" +
      ".gk-logo-wrap{justify-content:flex-start}" +
      ".gk-logo{width:124px;height:124px}" +
      ".gk-h{font-size:28px}" +
      ".gk-card{" +
      "flex-direction:row;" +
      "align-items:center;" +
      "justify-content:space-between;" +
      "}" +
      ".gk-card-head{" +
      "flex:1 1 auto;" +
      "min-width:0;" +
      "}" +
      ".gk-card-cta{" +
      "flex:0 0 190px;" +
      "display:flex;" +
      "justify-content:flex-end;" +
      "}" +
      ".gk-btn.block{" +
      "width:auto;" +
      "min-width:170px;" +
      "}" +
      "}";

    var st = document.createElement("style");
    st.id = "gk-clubgate-css-v10";
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  })();

  /* ------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------ */

  function render(html) {
    root.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderLoading(msg) {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h' style='font-size:20px'>" + escapeHtml(msg || "Laster…") + "</div>" +
      "  <div class='gk-p'>Et øyeblikk.</div>" +
      "</div>"
    );
  }

  function renderNeedLogin() {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h' style='font-size:22px'>Kun for medlemmer</div>" +
      "  <div class='gk-p'>Du må være innlogget for å se klubbkveld.</div>" +
      "  <div class='gk-top-actions'>" +
      "    <a class='gk-btn ok' href='" + LOGIN_URL + "'>Logg inn</a>" +
      "    <a class='gk-btn' href='mailto:" + CONTACT_EMAIL + "'>Kontakt oss</a>" +
      "  </div>" +
      "</div>"
    );
  }

  function renderIdentityNotFound() {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h' style='font-size:22px'>Fant ikke brukerinfo</div>" +
      "  <div class='gk-p'>Du er innlogget, men vi klarte ikke å lese navn fra kundekontoen.</div>" +
      "  <div class='gk-top-actions'>" +
      "    <a class='gk-btn' href='mailto:" + CONTACT_EMAIL + "'>Kontakt oss</a>" +
      "  </div>" +
      "</div>"
    );
  }

  function renderNoAccess(who) {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h' style='font-size:22px'>Ingen tilgang</div>" +
      "  <div class='gk-p'>Denne siden er kun tilgjengelig for aktive medlemmer eller ansatte.</div>" +
      (who ? "<div class='gk-note'>Innlogget som: " + escapeHtml(who) + "</div>" : "") +
      "  <div class='gk-top-actions'>" +
      "    <a class='gk-btn' href='mailto:" + CONTACT_EMAIL + "'>Send e-post til " + CONTACT_EMAIL + "</a>" +
      "  </div>" +
      "</div>"
    );
  }

  function renderMemberApiError(msg) {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h' style='font-size:22px'>Kunne ikke verifisere medlemskap</div>" +
      "  <div class='gk-p'>Medlemslisten kunne ikke lastes akkurat nå. Prøv igjen om litt.</div>" +
      (msg ? "<div class='gk-note'>" + escapeHtml(msg) + "</div>" : "") +
      "  <div class='gk-top-actions'>" +
      "    <a class='gk-btn' href='mailto:" + CONTACT_EMAIL + "'>Kontakt oss</a>" +
      "  </div>" +
      "</div>"
    );
  }

  /* ------------------------------------------------ */
  /* HELPERS */
  /* ------------------------------------------------ */

  function normalizeText(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function decodeHtml(str) {
    var el = document.createElement("textarea");
    el.innerHTML = String(str || "");
    return el.value;
  }

  function fetchSameOrigin(url) {
    return fetch(url, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store"
    });
  }

  function isLoggedIn() {
    return fetchSameOrigin("/customer/index").then(function (r) {
      var u = String(r.url || "");
      if (u.indexOf("/customer/login") !== -1) return false;
      if (!r.ok) return false;

      return r.text().then(function (html) {
        var low = String(html || "").toLowerCase();
        if (low.indexOf("name=\"password\"") !== -1) return false;
        return true;
      });
    }).catch(function () {
      return false;
    });
  }

  function getLoggedInIdentity() {
    var paths = [
      "/customer/details",
      "/customer/account",
      "/customer/index",
      "/customer/orders"
    ];

    var i = 0;

    function next() {
      if (i >= paths.length) {
        return Promise.resolve({ name: "", email: "" });
      }

      var path = paths[i++];

      return fetchSameOrigin(path)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var name = "";

          var mClass = html.match(/<div class="customer-nav-name">([\s\S]*?)<\/div>/i);
          if (mClass && mClass[1]) {
            name = decodeHtml(mClass[1]);
          }

          if (!name) {
            var mAlt = html.match(/alt="([^"]+)"/i);
            if (mAlt && mAlt[1]) {
              name = decodeHtml(mAlt[1]);
            }
          }

          name = String(name || "").trim();

          if (name) {
            console.log("[CLUBGATE] identity found on", path, { name: name, email: "" });
            return { name: name, email: "" };
          }

          return next();
        })
        .catch(function () {
          return next();
        });
    }

    return next();
  }

  function fetchMemberList() {
    var CACHE_KEY = "gk_club_members_v3";
    var CACHE_TTL_MS = 5 * 60 * 1000;

    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        var cached = JSON.parse(raw);
        if (
          cached &&
          typeof cached.ts === "number" &&
          Array.isArray(cached.data) &&
          (Date.now() - cached.ts) < CACHE_TTL_MS
        ) {
          console.log("[CLUBGATE] member list from cache:", cached.data.length);
          return Promise.resolve(cached.data);
        }
      }
    } catch (e) {}

    return fetch(MEMBER_API, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : [];
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            ts: Date.now(),
            data: list
          }));
        } catch (e) {}
        console.log("[CLUBGATE] member list from API:", list.length);
        return list;
      });
  }

  function userHasAccess(identity, members) {
    if (!identity || !members || !members.length) return false;

    var email = String(identity.email || "").trim().toLowerCase();
    var nameNorm = normalizeText(identity.name || "");

    if (!email && !nameNorm) return false;

    var allowedMap = {};
    for (var i = 0; i < ALLOWED_GROUPS.length; i++) {
      allowedMap[String(ALLOWED_GROUPS[i] || "").trim().toLowerCase()] = true;
    }

    for (var j = 0; j < members.length; j++) {
      var m = members[j];
      if (!m || !m.active) continue;

      var memberEmail = String(m.email || "").trim().toLowerCase();
      var memberNameNorm = normalizeText(m.name || "");

      var sameUser = false;
      if (email && memberEmail && email === memberEmail) sameUser = true;
      if (!sameUser && nameNorm && memberNameNorm && nameNorm === memberNameNorm) sameUser = true;

      if (!sameUser) continue;

      var groups = Array.isArray(m.groups) ? m.groups : [];
      for (var g = 0; g < groups.length; g++) {
        var groupName = String(groups[g] || "").trim().toLowerCase();
        if (allowedMap[groupName]) return true;
      }
    }

    return false;
  }

  /* ------------------------------------------------ */
  /* CART */
  /* ------------------------------------------------ */

  function postAddForm(bodyStr) {
    return fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: bodyStr,
      credentials: "same-origin"
    }).then(function (r) {
      return r.text();
    });
  }

  function addVariantToCart(productId, variantId, cb) {
    var body =
      "product_id=" + encodeURIComponent(String(productId)) +
      "&variant=" + encodeURIComponent(String(variantId)) +
      "&qty=1&quantity=1" +
      "&eventId=" + encodeURIComponent(String(EVENT_ID)) +
      "&page=product";

    postAddForm(body)
      .then(function () { cb(true); })
      .catch(function () { cb(false); });
  }

  function addProductToCart(productId, qty, cb) {
    if (!qty || qty <= 0) {
      cb(true);
      return;
    }

    var body =
      "product_id=" + encodeURIComponent(String(productId)) +
      "&qty=" + encodeURIComponent(String(qty)) +
      "&quantity=" + encodeURIComponent(String(qty)) +
      "&eventId=" + encodeURIComponent(String(EVENT_ID)) +
      "&page=product";

    postAddForm(body)
      .then(function () { cb(true); })
      .catch(function () { cb(false); });
  }

  /* ------------------------------------------------ */
  /* DATE HELPERS */
  /* ------------------------------------------------ */

  function nowDateOnly() {
    var n = new Date();
    n.setHours(0, 0, 0, 0);
    return n;
  }

  function parseDateFromVal(val) {
    var s = String(val || "");
    var m = s.match(/(\d{1,2})\.(\d{1,2})/);
    if (!m) return null;

    var dd = parseInt(m[1], 10);
    var mm = parseInt(m[2], 10);
    if (!dd || !mm) return null;

    var y = (new Date()).getFullYear();
    var d = new Date(y, mm - 1, dd);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function fmtISO(d) {
    var y = d.getFullYear();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    return y + "-" + m + "-" + day;
  }

  function sortByDate(a, b) {
    return a.dateObj.getTime() - b.dateObj.getTime();
  }

  /* ------------------------------------------------ */
  /* SETS */
  /* ------------------------------------------------ */

  var setsQty = 0;

  function getInt(key, def) {
    try {
      var v = parseInt(localStorage.getItem(key), 10);
      if (isNaN(v)) return def;
      return v;
    } catch (e) {
      return def;
    }
  }

  function saveSets() {
    try {
      localStorage.setItem("gk_ldk_sets_qty_v1", String(setsQty));
    } catch (e) {}
  }

  /* ------------------------------------------------ */
  /* RENDER PORTAL */
  /* ------------------------------------------------ */

  function renderAllowedPortal(list) {
    var html =
      "<div class='gk-box'>" +

      "  <div class='gk-topcard'>" +
      "    <div class='gk-topgrid'>" +

      "      <div class='gk-logo-wrap'>" +
      "        <img class='gk-logo' src='" + CLUB_LOGO + "' alt='Lyngdal Dartklubb logo'>" +
      "      </div>" +

      "      <div class='gk-toptext'>" +
      "        <div class='gk-h'>" + escapeHtml(CLUB_TITLE) + "</div>" +
      "        <div class='gk-p'>" + escapeHtml(CLUB_TIME) + "</div>" +
      "        <div class='gk-meta'>" +
      "          <div class='gk-chip price'>" + escapeHtml(CLUB_PRICE) + "</div>" +
      "          <div class='gk-chip'>Tilgang verifisert</div>" +
      "        </div>" +
      "        <div class='gk-p'>" + escapeHtml(CLUB_INFO) + "</div>" +
      "        <div class='gk-top-actions'>" +
      "          <a class='gk-btn ok' href='" + CART_URL + "'>Gå til handlekurv</a>" +
      "        </div>" +
      "      </div>" +

      "    </div>" +
      "  </div>" +

      "  <div class='gk-row'>" +
      "    <div class='gk-sets'>" +
      "      <div class='gk-sets-text'>" +
      "        <div class='gk-sets-title'>Leie pilsett</div>" +
      "        <div class='gk-sets-sub'>Valgfritt tillegg. Legges til sammen med påmelding for valgt torsdag.</div>" +
      "      </div>" +
      "      <div class='gk-sets-ctrl'>" +
      "        <button type='button' class='gk-sets-btn' id='gkSetsMinus' aria-label='Minus'>−</button>" +
      "        <div class='gk-sets-val' id='gkSetsVal'>0</div>" +
      "        <button type='button' class='gk-sets-btn' id='gkSetsPlus' aria-label='Pluss'>+</button>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +

      "  <div class='gk-row'>" +
      "    <div class='gk-section-head'>" +
      "      <div class='gk-section-title'>Velg torsdag</div>" +
      "      <div class='gk-note'>Kun datoer med ledige plasser vises. Datoer i fortid skjules automatisk.</div>" +
      "    </div>" +
      "    <div class='gk-list' id='gkLdkList'></div>" +
      "  </div>" +

      "</div>";

    render(html);

    setsQty = getInt("gk_ldk_sets_qty_v1", 0);
    if (setsQty < 0) setsQty = 0;
    if (setsQty > 8) setsQty = 8;

    var valEl = document.getElementById("gkSetsVal");
    var mBtn = document.getElementById("gkSetsMinus");
    var pBtn = document.getElementById("gkSetsPlus");

    function updateSets() {
      if (valEl) valEl.textContent = String(setsQty);
      saveSets();
    }
    updateSets();

    if (mBtn) {
      mBtn.onclick = function () {
        if (setsQty <= 0) return;
        setsQty -= 1;
        updateSets();
      };
    }

    if (pBtn) {
      pBtn.onclick = function () {
        if (setsQty >= 8) return;
        setsQty += 1;
        updateSets();
      };
    }

    var listEl = document.getElementById("gkLdkList");
    if (!listEl) return;

    if (!list || !list.length) {
      listEl.innerHTML = "<div class='gk-empty'>Ingen ledige torsdager akkurat nå.</div>";
      return;
    }

    listEl.innerHTML = "";

    for (var i = 0; i < list.length; i++) {
      (function () {
        var it = list[i];
        var total = 10;
        var booked = Math.max(0, total - (it.qty || 0));

        var card = document.createElement("div");
        card.className = "gk-card";

        var head = document.createElement("div");
        head.className = "gk-card-head";
        card.appendChild(head);

        var title = document.createElement("div");
        title.className = "gk-card-title";
        title.textContent = it.label;
        head.appendChild(title);

        var meta = document.createElement("div");
        meta.className = "gk-card-meta";
        head.appendChild(meta);

        var chipTime = document.createElement("div");
        chipTime.className = "gk-mini";
        chipTime.textContent = "Kl. 19:00–22:00";
        meta.appendChild(chipTime);

        var chipPrice = document.createElement("div");
        chipPrice.className = "gk-mini price";
        chipPrice.textContent = "50 kr";
        meta.appendChild(chipPrice);

        var chipBooked = document.createElement("div");
        chipBooked.className = "gk-mini";
        chipBooked.textContent = "Påmeldte: " + booked + "/" + total;
        meta.appendChild(chipBooked);

        var cta = document.createElement("div");
        cta.className = "gk-card-cta";
        card.appendChild(cta);

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gk-btn ok block";
        btn.textContent = "Meld på";
        cta.appendChild(btn);

        btn.onclick = function () {
          btn.disabled = true;
          btn.textContent = "Legger til…";

          addProductToCart(PRODUCT_SETS, setsQty, function (okSets) {
            if (!okSets) {
              btn.disabled = false;
              btn.textContent = "Meld på (feil – prøv igjen)";
              return;
            }

            addVariantToCart(PRODUCT_ID, it.variantId, function (okVar) {
              if (okVar) {
                btn.textContent = "Lagt i handlekurv ✓";
              } else {
                btn.disabled = false;
                btn.textContent = "Meld på (feil – prøv igjen)";
              }
            });
          });
        };

        listEl.appendChild(card);
      })();
    }
  }

  function buildThursdayList(product) {
    var out = [];
    var vars = product && product.variants ? product.variants : [];
    var today = nowDateOnly();

    for (var i = 0; i < vars.length; i++) {
      var v = vars[i];
      var qty = parseInt(v.qty || "0", 10);
      if (isNaN(qty) || qty <= 0) continue;

      var label = "";
      if (v.values && v.values.length) {
        label = String(v.values[0].val || "");
      }
      if (!label) continue;

      var d = parseDateFromVal(label);
      if (!d) continue;
      if (d.getTime() < today.getTime()) continue;

      out.push({
        label: label,
        dateObj: d,
        dateIso: fmtISO(d),
        variantId: String(v.id || ""),
        sku: String(v.sku || ""),
        qty: qty
      });
    }

    out.sort(sortByDate);
    return out;
  }

  /* ------------------------------------------------ */
  /* RUN */
  /* ------------------------------------------------ */

  renderLoading("Sjekker innlogging…");

  isLoggedIn().then(function (okLogin) {
    if (!okLogin) {
      renderNeedLogin();
      return;
    }

    renderLoading("Leser medlemsstatus…");

    getLoggedInIdentity().then(function (identity) {
      if (!identity || (!identity.name && !identity.email)) {
        console.log("[CLUBGATE] no identity found");
        renderIdentityNotFound();
        return;
      }

      console.log("[CLUBGATE] logged in identity:", identity);
      renderLoading("Verifiserer medlemskap…");

      fetchMemberList().then(function (members) {
        console.log("[CLUBGATE] member list loaded:", members.length);

        if (!userHasAccess(identity, members)) {
          renderNoAccess(identity.email || identity.name || "");
          return;
        }

        console.log("[CLUBGATE] access granted");
        renderLoading("Laster torsdager…");

        fetch(API_PRODUCT)
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var p = data && data.product ? data.product : null;
            var list = buildThursdayList(p);
            renderAllowedPortal(list);
          })
          .catch(function (e) {
            console.log("[CLUBGATE] product load error:", e);
            render(
              "<div class='gk-box'>" +
              "  <div class='gk-h' style='font-size:22px'>Kunne ikke laste torsdager</div>" +
              "  <div class='gk-p'>Sjekk console for detaljer.</div>" +
              "</div>"
            );
          });
      }).catch(function (e) {
        console.log("[CLUBGATE] member api error:", e);
        renderMemberApiError(String(e && e.message ? e.message : e));
      });
    });
  });

})();
