/* Стиль карты смога «Дымка» (v37, по умолчанию): мягкая поверхность AQI поверх спокойной серой подложки.
 * ?mapstyle=off — вернуть прежние круги с цифрами (сохраняется), ?mapstyle=a — снова «Дымка». */
window.MS_STYLE = (() => { try { const q = (new URL(location.href).searchParams.get("mapstyle") || "").toLowerCase();
  if (q === "off" || q === "a") localStorage.setItem("tazaAba.mapstyle", q);
  return localStorage.getItem("tazaAba.mapstyle") === "off" ? null : "a"; } catch (e) { return "a"; } })();
const MS_BIN = ["#3DBE8B", "#EDB443", "#F59245", "#E5534B", "#9A5BD0", "#7A2340"];
const msBinI = a => a <= 50 ? 0 : a <= 100 ? 1 : a <= 150 ? 2 : a <= 200 ? 3 : a <= 300 ? 4 : 5;
const msBin = a => a == null ? "#9aa5ad" : MS_BIN[msBinI(a)];
const msBinRGB = a => { const h = msBin(a); return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); };
const msDark = () => document.documentElement.dataset.theme === "dark";
const MS_T = {
  ru: { note: "Оценка: AQI сглажен между районами (модель CAMS + датчики)", lo: "Чище всего", hi: "Грязнее всего", all: "Везде" },
  ky: { note: "Баалоо: AQI райондордун ортосунда жылмаланган (CAMS модели + датчиктер)", lo: "Эң таза", hi: "Эң булганыч", all: "Бардык жерде" },
  en: { note: "Estimate: AQI smoothed between districts (CAMS model + sensors)", lo: "Cleanest", hi: "Most polluted", all: "Everywhere" },
  tr: { note: "Tahmin: AQI mahalleler arasında yumuşatıldı (CAMS modeli + sensörler)", lo: "En temiz", hi: "En kirli", all: "Her yerde" } };
const MST = k => (MS_T[LANG] || MS_T.ru)[k];
function msBaseTile() { const k = msDark() ? "Dark" : "Light";
  return L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${k}_Gray_Base/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 18, maxNativeZoom: 16, keepBuffer: 2, className: "tl-ms", attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors" }); }
function msRefTile() { const k = msDark() ? "Dark" : "Light";
  return L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${k}_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 18, maxNativeZoom: 16, pane: "msRef", className: "tl-ms" }); }
const msPts = () => DISTRICTS.map(d => ({ d, a: air.byDistrict[d.id] && air.byDistrict[d.id].aqi })).filter(p => p.a != null);

/* canvas-слой: перерисовка после движения/зума, анимация зума как у ImageOverlay */
const MsCanvas = L.Layer.extend({
  initialize(draw) { this._draw = draw; },
  onAdd(m) { this._c = L.DomUtil.create("canvas", "ms-cv leaflet-zoom-animated"); this._c.style.pointerEvents = "none"; m.getPane("overlayPane").appendChild(this._c);
    m.on("moveend zoomend resize", this._redraw, this); m.on("zoomanim", this._anim, this); this._redraw(); },
  onRemove(m) { this._c.remove(); m.off("moveend zoomend resize", this._redraw, this); m.off("zoomanim", this._anim, this); },
  _anim(e) { if (!this._b) return; const s = this._map.getZoomScale(e.zoom), o = this._map._latLngBoundsToNewLayerBounds(this._b, e.zoom, e.center).min; L.DomUtil.setTransform(this._c, o, s); },
  _redraw() { const m = this._map; if (!m) return; const sz = m.getSize(), pad = sz.multiplyBy(0.15), tl = m.containerPointToLayerPoint([0, 0]).subtract(pad), w = sz.x + 2 * pad.x, h = sz.y + 2 * pad.y;
    this._b = L.latLngBounds(m.layerPointToLatLng(tl), m.layerPointToLatLng(tl.add([w, h])));
    const c = this._c; c.width = w; c.height = h; c.style.width = w + "px"; c.style.height = h + "px"; L.DomUtil.setPosition(c, tl);
    this._draw(c.getContext("2d"), tl, m, w, h); } });
function msIdw(lat, lon, pts) { let s = 0, w = 0, dmin = 1e9; const k = Math.cos(lat * Math.PI / 180) * 111;
  for (const p of pts) { const dx = (p.d.lon - lon) * k, dy = (p.d.lat - lat) * 111, d2 = dx * dx + dy * dy + 0.04; if (d2 < dmin) dmin = d2; const ww = 1 / (d2 * d2); s += ww * p.a; w += ww; }
  return { v: s / w, dmin: Math.sqrt(dmin) }; }
function msNearest(ll) { let b = null; for (const p of msPts()) { const k = kmDist(p.d, { lat: ll.lat, lon: ll.lng }); if (!b || k < b.k) b = { ...p, k }; } return b; }

function msSmog(M, G, popD) {
  const cont = M.getContainer(); cont.classList.add("ms-on", "ms-a");
  if (!M.getPane("msRef")) { const pn = M.createPane("msRef"); pn.style.zIndex = 450; pn.style.pointerEvents = "none"; }
  let ref = null; const syncRef = mode => { if (ref) M.removeLayer(ref); ref = mode === "osm" ? msRefTile().addTo(M) : null; }; syncRef(baseMode()); M.on("basemode", e => syncRef(e.mode));
  if (M.getSize().x < 600) cont.insertAdjacentHTML("afterend", `<div class="ms-note ms-note-out">${esc(MST("note"))} · ▼ ${esc(MST("lo").toLowerCase())} · ▲ ${esc(MST("hi").toLowerCase())}</div>`);
  else { const note = L.control({ position: "bottomleft" }); note.onAdd = () => { const d = L.DomUtil.create("div", "ms-note"); d.textContent = MST("note"); return d; }; note.addTo(M); }
  /* легенда под картой — та же палитра */
  const lg = cont.closest(".map-col") && cont.closest(".map-col").querySelector(".legend");
  if (lg) lg.querySelectorAll("span").forEach((s, i) => { s.style.background = MS_BIN[i]; s.style.color = i === 1 ? "#3b2a00" : "#fff"; });
  M.on("click", e => { if (!G._map) return; const n = msNearest(e.latlng); if (n && n.k < 4) L.popup().setLatLng([n.d.lat, n.d.lon]).setContent(popD(n.d)).openOn(M); });
  const S = (typeof LOWEND !== "undefined" && LOWEND) ? 9 : 6;
  const cv = new MsCanvas((ctx, tl, m, w, h) => { const pts = msPts(); if (!pts.length) return; const gw = Math.ceil(w / S), gh = Math.ceil(h / S), dk = msDark();
    const off = document.createElement("canvas"); off.width = gw; off.height = gh; const oc = off.getContext("2d"), img = oc.createImageData(gw, gh), A = dk ? 195 : 150;
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const ll = m.layerPointToLatLng(tl.add([i * S, j * S])), r = msIdw(ll.lat, ll.lng, pts), c = msBinRGB(r.v);
      const al = Math.max(0, Math.min(1, 1 - (r.dmin - 1.2) / 2.5)), k = (j * gw + i) * 4; img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = Math.round(al * A); }
    oc.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = true; ctx.filter = `blur(${Math.round(S * 1.6)}px)`; ctx.drawImage(off, 0, 0, gw * S, gh * S); });
  cv.addTo(G);
  const lblG = L.layerGroup().addTo(G);
  const pill = (p, cls, txt) => { L.circleMarker([p.d.lat, p.d.lon], { radius: 4.5, weight: 2, color: msDark() ? "#0d1620" : "#fff", fillColor: msBin(p.a), fillOpacity: 1 }).bindPopup(() => popD(p.d)).addTo(lblG);
    L.marker([p.d.lat, p.d.lon], { keyboard: false, icon: L.divIcon({ className: "ms-lbl-w", html: `<div class="ms-lbl ${cls}"><i style="background:${msBin(p.a)}"></i><span>${txt}</span> <b>${p.a}</b></div>`, iconSize: [0, 0] }) }).bindPopup(() => popD(p.d)).addTo(lblG); };
  const upd = () => { cv._redraw(); lblG.clearLayers(); const pts = msPts(); if (!pts.length) return; const s = [...pts].sort((x, y) => x.a - y.a), lo = s[0], hi = s[s.length - 1];
    if (hi.a - lo.a < 10) { pill({ d: { lat: cityObj().center[0], lon: cityObj().center[1] }, a: Math.round(median(pts.map(p => p.a))) }, "all", esc(MST("all")) + " ≈"); return; }
    pill(lo, "lo", `<em>${esc(MST("lo"))} · </em>${esc(dName(lo.d))}`); pill(hi, "hi", `<em>${esc(MST("hi"))} · </em>${esc(dName(hi.d))}`); };
  upd();
  return upd;
}
const msHomeIcon = () => L.divIcon({ className: "", html: `<div class="ms-home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-6 8 6v8h-5v-5h-6v5H4z"/></svg></div>`, iconSize: [18, 18], iconAnchor: [9, 9] });
