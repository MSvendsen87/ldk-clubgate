(function () {
  console.log("[CLUBGATE v3] LOADED");

  // Siden som skal låses
  var ALLOWED_PATH = "/sider/klubbkveld-lyngdal-dart";

  // Produkt som kun medlemmer skal kunne se (gruppe/probe)
  var GROUP_PROBE_PATH = "/utleie-og-booking/ldk-tilgang";

  // Markør du la inn i produktbeskrivelsen
  var ACCESS_MARKER_ID = "gk-ldk-access-ok";

  var LOGIN_URL = "/customer/login";
  var CONTACT_EMAIL = "post@golfkongen.no";

  // Path check
  var path = String(location.pathname || "");
  while (path.length && path.charAt(path.length - 1) === "/" && path !== "/") path = path.slice(0, -1);
  if (path !== ALLOWED_PATH) return;

  var root = document.getElementById("gk-clubgate");
  if (!root) return;

  // Styles (GK dark)
  (function cssOnce(){
    if (document.getElementById("gk-clubgate-css-v3")) return;
    var css =
      ":root{--gk-bg:#111;--gk-card:#171717;--gk-line:rgba(255,255,255,.10);--gk-text:rgba(255,255,255,.92);--gk-muted:rgba(255,255,255,.72);--gk-ac:#2bd18b;--gk-ac2:#7dffb8}" +
      "#gk-clubgate{max-width:980px;margin:0 auto;padding:14px;color:var(--gk-text)}" +
      ".gk-box{border:1px solid var(--gk-line);background:linear-gradient(180deg,#171717,#101010);border-radius:18px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.35)}" +
      ".gk-h{font-weight:900;font-size:18px;margin:0 0 6px 0}" +
      ".gk-p{margin:0;color:var(--gk-muted);line-height:1.45}" +
      ".gk-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}" +
      ".gk-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:var(--gk-text);text-decoration:none;font-weight:900}" +
      ".gk-btn.ok{border-color:rgba(43,209,139,.55);background:linear-gradient(135deg, rgba(43,209,139,.18), rgba(125,255,184,.08))}" +
      ".gk-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--gk-muted);margin-top:10px}" +
      ".gk-dot{width:10px;height:10px;border-radius:999px;background:linear-gradient(135deg,var(--gk-ac),var(--gk-ac2));box-shadow:0 0 0 4px rgba(43,209,139,.12)}";
    var st = document.createElement("style");
    st.id = "gk-clubgate-css-v3";
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  })();

  function render(html) { root.innerHTML = html; }

  function renderLoading() {
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h'>Sjekker tilgang…</div>" +
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

  function renderAllowed() {
    // ✅ Her legger vi klubbinnholdet (vi kan bygge dette videre senere)
    render(
      "<div class='gk-box'>" +
      "  <div class='gk-h'>Klubbkvelder – Lyngdal dartklubb</div>" +
      "  <div class='gk-p'>Velkommen! Dette innholdet er kun synlig for medlemmer.</div>" +
      "  <div class='gk-badge'><span class='gk-dot'></span> Tilgang verifisert</div>" +
      "</div>"
    );
  }

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
      // Hvis Quickbutik redirecter (f.eks. til / eller login), sjekk url
      var finalUrl = String(r.url || "");
      if (finalUrl.indexOf(GROUP_PROBE_PATH) === -1) return false;
      if (!r.ok) return false;

      return r.text().then(function (html) {
        // Marker i produktbeskrivelse
        return String(html || "").indexOf(ACCESS_MARKER_ID) !== -1;
      });
    }).catch(function () { return false; });
  }

  renderLoading();

  isLoggedIn().then(function (okLogin) {
    if (!okLogin) { renderNeedLogin(); return; }

    hasGroupAccessViaProduct().then(function (okGroup) {
      if (!okGroup) { renderNoAccess(); return; }
      renderAllowed();
    });
  });

})();
