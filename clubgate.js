(function () {
  console.log("[CLUBGATE v4] LOADED");

  // ---- Konfig ----
  var ALLOWED_PATH = "/sider/klubbkveld-lyngdal-dart";

  // LDK Tilgang (produktet med varianter per torsdag)
  var PRODUCT_ID = "1322";

  // Pilsett (samme som dart – valgfritt pr kveld)
  var PRODUCT_SETS = "1318";

  // EventId (samme som dere bruker i booking)
  var EVENT_ID = "9847005";

  // API (samme worker som booking)
  var API_BASE = "https://cold-shadow-36dc.post-cd6.workers.dev/products/";
  var API_PRODUCT = API_BASE + PRODUCT_ID;

  // Probe-produkt for tilgang (din eksisterende løsning)
  var GROUP_PROBE_PATH = "/utleie-og-booking/ldk-tilgang";
  var ACCESS_MARKER_ID = "gk-ldk-access-ok";

  var LOGIN_URL = "/customer/login";
  var CART_URL = "/cart/index";
  var CONTACT_EMAIL = "post@golfkongen.no";

  // ---- Path check ----
  var path = String(location.pathname || "");
  while (path.length && path.charAt(path.length - 1) === "/" && path !== "/") path = path.slice(0, -1);
  if (path !== ALLOWED_PATH) return;

  var root = document.getElementById("gk-clubgate");
  if (!root) return;

  // ---- Styles (GK dark) ----
  (function cssOnce() {
    if (document.getElementById("gk-clubgate-css-v4")) return;
    var css =
      ":root{--gk-bg:#111;--gk-card:#171717;--gk-card2:#101010;--gk-line:rgba(255,255,255,.10);--gk-soft:rgba(255,255,255,.06);--gk-text:rgba(255,255,255,.92);--gk-muted:rgba(255,255,255,.72);--gk-ac:#2bd18b;--gk-ac2:#7dffb8}" +
      "#gk-clubgate{max-width:980px;margin:0 auto;padding:14px;color:var(--gk-text)}" +
      ".gk-box{border:1px solid var(--gk-line);background:linear-gradient(180deg,var(--gk-card),var(--gk-card2));border-radius:18px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.35)}" +
      ".gk-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}" +
      ".gk-h{font-weight:900;font-size:18px;margin:0 0 6px 0}" +
      ".gk-p{margin:0;color:var(--gk-muted);line-height:1.45}" +
      ".gk-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}" +
      ".gk-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:var(--gk-text);text-decoration:none;font-weight:900;cursor:pointer}" +
      ".gk-btn.ok{border-color:rgba(43,209,139,.55);background:linear-gradient(135deg, rgba(43,209,139,.18), rgba(125,255,184,.08))}" +
      ".gk-btn:active{transform:scale(.99)}" +
      ".gk-note{margin-top:10px;font-size:12px;color:var(--gk-muted);line-height:1.35}" +
      ".gk-row{margin-top:12px;border-top:1px solid var(--gk-line);padding-top:12px}" +
      ".gk-sets{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;padding:10px;border:1px solid var(--gk-line);border-radius:14px;background:rgba(255,255,255,.04)}" +
      ".gk-sets strong{font-weight:900}" +
      ".gk-sets-ctrl{display:flex;align-items:center;gap:10px}" +
      ".gk-sets-btn{width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:var(--gk-text);font-weight:900;font-size:18px;cursor:pointer}" +
      ".gk-sets-val{min-width:28px;text-align:center;font-weight:900;font-size:16px}" +
      ".gk-list{display:flex;flex-direction:column;gap:10px;margin-top:12px}" +
      ".gk-card{border:1px solid var(--gk-line);border-radius:16px;padding:12px;background:rgba(255,255,255,.03);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}" +
      ".gk-card-left{display:flex;flex-direction:column;gap:4px}" +
      ".gk-card-title{font-weight:900}" +
      ".gk-card-sub{font-size:12px;color:var(--gk-muted)}" +
      ".gk-pill{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--gk-muted)}" +
      ".gk-dot{width:10px;height:10px;border-radius:999px;background:linear-gradient(135deg,var(--gk-ac),var(--gk-ac2));box-shadow:0 0 0 4px rgba(43,209,139,.12)}" +
      ".gk-empty{padding:10px;color:var(--gk-muted)}" +
      ".gk-att{margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,255,255,.12);font-size:12px;color:var(--gk-muted)}";
    var st = document.createElement("style");
    st.id = "gk-clubgate-css-v4";
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  })();

  function render(html) { root.innerHTML = html; }

  function renderLoading(msg) {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h'>" + (msg || "Sjekker tilgang…") + "</div>" +
      "  <div class='gk-p'>Et øyeblikk.</div>" +
      "</div>"
    );
  }

  function renderNeedLogin() {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h'>Kun for medlemmer</div>" +
      "  <div class='gk-p'>Du må være innlogget for å se klubbkvelder.</div>" +
      "  <div class='gk-actions'>" +
      "    <a class='gk-btn ok' href='" + LOGIN_URL + "'>Logg inn</a>" +
      "    <a class='gk-btn' href='mailto:" + CONTACT_EMAIL + "'>Kontakt oss</a>" +
      "  </div>" +
      "</div>"
    );
  }

  function renderNoAccess() {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h'>Ingen tilgang</div>" +
      "  <div class='gk-p'>Denne siden er kun tilgjengelig for medlemmer i Lyngdal dartklubb.</div>" +
      "  <div class='gk-actions'>" +
      "    <a class='gk-btn' href='mailto:" + CONTACT_EMAIL + "'>Send e-post til " + CONTACT_EMAIL + "</a>" +
      "  </div>" +
      "</div>"
    );
  }

  // ---- Cart helpers (samme mønster som booking) ----
  function postAddForm(bodyStr) {
    return fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: bodyStr,
      credentials: "same-origin"
    }).then(function (r) { return r.text(); });
  }

  function addVariantToCart(productId, variantId, cb) {
    var body =
      "product_id=" + encodeURIComponent(String(productId)) +
      "&variant=" + encodeURIComponent(String(variantId)) +
      "&qty=1&quantity=1" +
      "&eventId=" + encodeURIComponent(String(EVENT_ID)) +
      "&page=product";

    postAddForm(body).then(function () { cb(true); })
      .catch(function () { cb(false); });
  }

  function addProductToCart(productId, qty, cb) {
    if (!qty || qty <= 0) { cb(true); return; }
    var body =
      "product_id=" + encodeURIComponent(String(productId)) +
      "&qty=" + encodeURIComponent(String(qty)) +
      "&quantity=" + encodeURIComponent(String(qty)) +
      "&eventId=" + encodeURIComponent(String(EVENT_ID)) +
      "&page=product";

    postAddForm(body).then(function () { cb(true); })
      .catch(function () { cb(false); });
  }

  // ---- Login + access checks ----
  function fetchSameOrigin(url) {
    return fetch(url, { method: "GET", credentials: "same-origin", cache: "no-store" });
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
    }).catch(function () { return false; });
  }

  function hasGroupAccessViaProduct() {
    return fetchSameOrigin(GROUP_PROBE_PATH).then(function (r) {
      var finalUrl = String(r.url || "");
      if (finalUrl.indexOf(GROUP_PROBE_PATH) === -1) return false;
      if (!r.ok) return false;
      return r.text().then(function (html) {
        return String(html || "").indexOf(ACCESS_MARKER_ID) !== -1;
      });
    }).catch(function () { return false; });
  }

  // ---- Data parsing (torsdag "12.03" osv) ----
  function nowDateOnly() {
    var n = new Date();
    n.setHours(0, 0, 0, 0);
    return n;
  }

  function parseDateFromVal(val) {
    // "Torsdag 12.03" -> yyyy-mm-dd (antar inneværende år)
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

  // ---- State (pilsett) ----
  var setsQty = 0;
  function getInt(key, def) {
    try {
      var v = parseInt(localStorage.getItem(key), 10);
      if (isNaN(v)) return def;
      return v;
    } catch (e) { return def; }
  }
  function saveSets() {
    try { localStorage.setItem("gk_ldk_sets_qty_v1", String(setsQty)); } catch (e) {}
  }

  // ---- Optional attendees (placeholder) ----
  // Dette krever backend (se forklaring under). Foreløpig er det AV.
  var ENABLE_ATTENDEES = false;
  function loadAttendeesForVariant(variantId) {
    return Promise.resolve([]); // placeholder
  }

  // ---- Render allowed (portal) ----
  function renderAllowedPortal(list) {
    // Top / header
    var html =
      "<div class='gk-box'>" +
      "  <div class='gk-top'>" +
      "    <div>" +
      "      <div class='gk-h'>Klubbkveld – Lyngdal dartklubb</div>" +
      "      <div class='gk-p'>Torsdager kl. <b>19:00–22:00</b> · <b>50 kr</b> per kveld (plasser styres av lagersaldo).</div>" +
      "      <div class='gk-pill' style='margin-top:10px'><span class='gk-dot'></span> Tilgang verifisert</div>" +
      "    </div>" +
      "    <div class='gk-actions' style='margin-top:0'>" +
      "      <a class='gk-btn ok' href='" + CART_URL + "'>Gå til handlekurv</a>" +
      "    </div>" +
      "  </div>" +

      "  <div class='gk-sets'>" +
      "    <div style='flex:1 1 auto;min-width:220px'>" +
      "      <strong>Leie pilsett</strong>" +
      "      <div class='gk-note'>Valgfritt. Legges til sammen med påmelding for valgt torsdag.</div>" +
      "    </div>" +
      "    <div class='gk-sets-ctrl'>" +
      "      <button type='button' class='gk-sets-btn' id='gkSetsMinus'>−</button>" +
      "      <div class='gk-sets-val' id='gkSetsVal'>0</div>" +
      "      <button type='button' class='gk-sets-btn' id='gkSetsPlus'>+</button>" +
      "    </div>" +
      "  </div>" +

      "  <div class='gk-row'>" +
      "    <div class='gk-h' style='font-size:16px;margin-bottom:0'>Velg torsdag</div>" +
      "    <div class='gk-note'>Kun datoer med ledige plasser vises. Datoer i fortid skjules automatisk.</div>" +
      "    <div class='gk-list' id='gkLdkList'></div>" +
      "  </div>" +
      "</div>";

    render(html);

    // Sets UI
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

    if (mBtn) mBtn.onclick = function () {
      if (setsQty <= 0) return;
      setsQty -= 1;
      updateSets();
    };
    if (pBtn) pBtn.onclick = function () {
      if (setsQty >= 8) return;
      setsQty += 1;
      updateSets();
    };

    // List
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

        var card = document.createElement("div");
        card.className = "gk-card";

        var left = document.createElement("div");
        left.className = "gk-card-left";
        card.appendChild(left);

        var t = document.createElement("div");
        t.className = "gk-card-title";
        t.textContent = it.label; // "Torsdag 12.03"
        left.appendChild(t);

        var sub = document.createElement("div");
        sub.className = "gk-card-sub";
        var total = 10; // standard plasser per torsdag
var booked = Math.max(0, total - (it.qty || 0));
sub.textContent = "Kl. 19:00–22:00 · 50 kr · Påmeldte: " + booked + "/" + total + " · Ledige: " + it.qty;
        if ((it.qty || 0) <= 0) {
  btn.disabled = true;
  btn.textContent = "Full booket";
  btn.className = "gk-btn";
}
        left.appendChild(sub);

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gk-btn ok";
        btn.textContent = "Meld på";
        card.appendChild(btn);

        // optional attendees placeholder
        if (ENABLE_ATTENDEES) {
          var att = document.createElement("div");
          att.className = "gk-att";
          att.textContent = "Laster påmeldte…";
          left.appendChild(att);

          loadAttendeesForVariant(it.variantId).then(function (names) {
            if (!names || !names.length) att.textContent = "Ingen påmeldte vist ennå.";
            else att.textContent = "Påmeldte: " + names.join(", ");
          }).catch(function () {
            att.textContent = "Kunne ikke laste påmeldte.";
          });
        }

        btn.onclick = function () {
          btn.disabled = true;
          btn.textContent = "Legger til…";

          // 1) legg til pilsett (hvis valgt)
          addProductToCart(PRODUCT_SETS, setsQty, function (okSets) {
            if (!okSets) {
              btn.disabled = false;
              btn.textContent = "Meld på (feil – prøv igjen)";
              return;
            }

            // 2) legg til riktig variant av LDK Tilgang
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

  // ---- Load variants ----
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
        // name: "Dato", val: "Torsdag 12.03"
        label = String(v.values[0].val || "");
      }
      if (!label) continue;

      var d = parseDateFromVal(label);
      if (!d) continue;

      // skjul fortid
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

  // ---- Run ----
  renderLoading();

  isLoggedIn().then(function (okLogin) {
    if (!okLogin) { renderNeedLogin(); return; }

    renderLoading("Verifiserer medlemskap…");
    hasGroupAccessViaProduct().then(function (okGroup) {
      if (!okGroup) { renderNoAccess(); return; }

      renderLoading("Laster torsdager…");

      fetch(API_PRODUCT)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var p = data && data.product ? data.product : null;
          var list = buildThursdayList(p);
          renderAllowedPortal(list);
        })
        .catch(function (e) {
          console.log("[CLUBGATE] load error:", e);
          render(
            "<div class='gk-box'>" +
            "  <div class='gk-h'>Kunne ikke laste torsdager</div>" +
            "  <div class='gk-p'>Sjekk console for detaljer.</div>" +
            "</div>"
          );
        });
    });
  });

})();
