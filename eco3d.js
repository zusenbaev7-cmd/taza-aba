/* Таза Аба — 3D-навигатор эко-маршрута (v41, прототип). Грузится лениво из eco.js; MapLibre GL (CSP-сборка, локально в vendor/maplibre),
 * векторные тайлы OpenFreeMap, 3D-здания. Камера от третьего лица, «курс вверх», аватар идёт по маршруту; режим GPS — следование за реальной позицией. */
(function () {
  const T3 = {
    ru: { play: "Старт", pause: "Пауза", gps: "GPS", gpsOn: "Слежу за GPS", gpsErr: "GPS недоступен", off: "Вы в {m} м от маршрута", left: "осталось", ahead: "Впереди {d}", close: "Закрыть", sim: "Симуляция", est: "оценка «Дымка»", done: "Маршрут пройден 🎉", speed: "Скорость" },
    ky: { play: "Баштоо", pause: "Тыным", gps: "GPS", gpsOn: "GPS ээрчип жатам", gpsErr: "GPS жеткиликсиз", off: "Маршруттан {m} м алыстадыңыз", left: "калды", ahead: "Алдыда {d}", close: "Жабуу", sim: "Симуляция", est: "«Дымка» баалоосу", done: "Маршрут бүттү 🎉", speed: "Ылдамдык" },
    en: { play: "Start", pause: "Pause", gps: "GPS", gpsOn: "Following GPS", gpsErr: "GPS unavailable", off: "You are {m} m off the route", left: "left", ahead: "Next {d}", close: "Close", sim: "Simulation", est: "“Dymka” estimate", done: "Route complete 🎉", speed: "Speed" },
    tr: { play: "Başlat", pause: "Duraklat", gps: "GPS", gpsOn: "GPS takip ediliyor", gpsErr: "GPS yok", off: "Rotadan {m} m uzaktasınız", left: "kaldı", ahead: "Sonraki {d}", close: "Kapat", sim: "Simülasyon", est: "“Dymka” tahmini", done: "Rota tamamlandı 🎉", speed: "Hız" } };
  const tt = (k, o) => { let s = (T3[LANG] || T3.ru)[k]; if (o) for (const [a, b] of Object.entries(o)) s = s.replace("{" + a + "}", b); return s; };
  const RM = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
  let libP = null;
  const lib = () => libP || (libP = new Promise((ok, no) => { const c = document.createElement("link"); c.rel = "stylesheet"; c.href = "vendor/maplibre/maplibre-gl.css"; document.head.appendChild(c);
    const s = document.createElement("script"); s.src = "vendor/maplibre/maplibre-gl-csp.js"; s.onload = () => { maplibregl.setWorkerUrl("vendor/maplibre/maplibre-gl-csp-worker.js"); ok(); }; s.onerror = no; document.head.appendChild(s); }));
  const bearing = (a, b) => { const r = Math.PI / 180, y = Math.sin((b[1] - a[1]) * r) * Math.cos(b[0] * r), x = Math.cos(a[0] * r) * Math.sin(b[0] * r) - Math.sin(a[0] * r) * Math.cos(b[0] * r) * Math.cos((b[1] - a[1]) * r); return (Math.atan2(y, x) / r + 360) % 360; };
  window.eco3dOpen = async function (route, mode) {
    const dk = document.documentElement.dataset.theme === "dark", S = route.S, G = route.geom, total = route.km, spd0 = { walk: 4.6, bike: 14, car: 30 }[mode] || 4.6;
    const cum = [0]; for (let i = 1; i < G.length; i++) cum.push(cum[i - 1] + ecoKm(G[i - 1], G[i]));
    const w = document.createElement("div"); w.className = "e3"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true");
    w.innerHTML = `<div id="e3map"></div>
      <div class="e3-top"><div class="e3-hud"><div class="e3-next"><i></i><span></span></div><div class="e3-stats"><b class="e3-rem"></b><span class="e3-km"></span></div><div class="e3-prog"><i></i></div><small class="e3-est">${esc(tt("est"))}</small></div>
        <button class="e3-x" aria-label="${esc(tt("close"))}">✕</button></div>
      <div class="e3-bot"><button class="e3-play"></button><div class="e3-spd" role="group" aria-label="${esc(tt("speed"))}">${[1, 4, 16].map(x => `<button data-s="${x}">${x}×</button>`).join("")}</div><button class="e3-gps">${esc(tt("gps"))}</button></div>
      <div class="e3-toast" hidden></div>`;
    document.body.appendChild(w); document.documentElement.classList.add("e3-open");
    try { await lib(); } catch (e) { w.remove(); document.documentElement.classList.remove("e3-open"); return toast("3D: MapLibre load error"); }
    const mapEl = w.querySelector("#e3map");
    const m = new maplibregl.Map({ container: mapEl, style: `https://tiles.openfreemap.org/styles/${dk ? "dark" : "liberty"}`, center: [G[0][1], G[0][0]], zoom: 17, pitch: 62, bearing: bearing(G[0], G[Math.min(5, G.length - 1)]), attributionControl: { compact: true }, maxPitch: 75, canvasContextAttributes: { antialias: true } });
    let pos = 0, playing = false, speed = RM ? 1 : 4, gpsW = null, last = 0, br = m.getBearing(), raf = 0;
    const at = km => { let i = 1; while (i < cum.length - 1 && cum[i] < km) i++; const k = cum[i] - cum[i - 1] ? (km - cum[i - 1]) / (cum[i] - cum[i - 1]) : 0, a = G[i - 1], b = G[i]; return { ll: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], i }; };
    const aqiAt = km => { let best = S[0]; for (const s of S) if (Math.abs(s.km - km) < Math.abs(best.km - km)) best = s; return best.a; };
    const av = document.createElement("div"); av.className = "e3-av " + mode; av.innerHTML = `<i class="e3-pulse"></i><span>${ECO_ICON[mode]}</span>`;
    const mk = new maplibregl.Marker({ element: av, rotationAlignment: "viewport", pitchAlignment: "viewport" }).setLngLat([G[0][1], G[0][0]]);
    m.on("load", () => {
      const L0 = m.getStyle().layers.find(l => l.type === "symbol")?.id;
      if (!m.getLayer("building-3d")) m.addLayer({ id: "e3-bld", type: "fill-extrusion", source: "openmaptiles", "source-layer": "building", minzoom: 14, paint: { "fill-extrusion-color": dk ? "#1d2833" : "#dfe5ea", "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8], "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0], "fill-extrusion-opacity": .85 } }, L0);
      else { m.setPaintProperty("building-3d", "fill-extrusion-color", dk ? "#1d2833" : "#e3e7ea"); m.setPaintProperty("building-3d", "fill-extrusion-opacity", .8); }
      m.addSource("e3r", { type: "geojson", lineMetrics: true, data: { type: "Feature", geometry: { type: "LineString", coordinates: G.map(p => [p[1], p[0]]) } } });
      const stops = []; S.forEach(s => { const f = total ? s.km / total : 0; if (!stops.length || f > stops[stops.length - 2] + 0.004) stops.push(Math.min(1, f), ecoCol(s.a ?? 50)); });
      if (stops[0] !== 0) stops.unshift(0, stops[1]); if (stops[stops.length - 2] < 1) stops.push(1, stops[stops.length - 1]);
      m.addLayer({ id: "e3-glow", type: "line", source: "e3r", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#4aa3dc", "line-width": 26, "line-opacity": .22, "line-blur": 10 } });
      m.addLayer({ id: "e3-case", type: "line", source: "e3r", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": dk ? "#081018" : "#ffffff", "line-width": 14 } });
      m.addLayer({ id: "e3-line", type: "line", source: "e3r", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-width": 8, "line-gradient": ["interpolate", ["linear"], ["line-progress"], ...stops] } });
      m.addSource("e3d", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } } });
      m.addLayer({ id: "e3-done", type: "line", source: "e3d", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-width": 8.5, "line-color": dk ? "#3a4651" : "#b8c2cb" } });
      mk.addTo(m); update(true);
    });
    const hud = { next: w.querySelector(".e3-next span"), dot: w.querySelector(".e3-next i"), rem: w.querySelector(".e3-rem"), km: w.querySelector(".e3-km"), prog: w.querySelector(".e3-prog i") };
    const showToast = s => { const x = w.querySelector(".e3-toast"); x.textContent = s; x.hidden = false; clearTimeout(x._t); x._t = setTimeout(() => x.hidden = true, 3500); };
    function update(jump) {
      const p = at(pos), ahead = Math.min(total, pos + 0.3), a1 = aqiAt(Math.min(total, pos + 0.15)), look = at(Math.min(total, pos + 0.04)), tb = bearing(p.ll, look.ll.every((v, i) => v === p.ll[i]) ? G[Math.min(G.length - 1, p.i)] : look.ll);
      let d = ((tb - br + 540) % 360) - 180; br = (br + d * (jump || RM ? 1 : 0.12) + 360) % 360;
      mk.setLngLat([p.ll[1], p.ll[0]]);
      m.jumpTo({ center: [p.ll[1], p.ll[0]], bearing: br, pitch: 62, zoom: mode === "car" ? 16.2 : 17, padding: { top: mapEl.clientHeight * 0.38, bottom: 0, left: 0, right: 0 } });
      const now = performance.now(); if (m.getSource("e3d") && (jump || now - (update.t || 0) > 250)) { update.t = now; m.getSource("e3d").setData({ type: "Feature", geometry: { type: "LineString", coordinates: [...G.slice(0, p.i).map(q => [q[1], q[0]]), [p.ll[1], p.ll[0]]] } }); }
      const remKm = Math.max(0, total - pos), remS = total ? route.dur * remKm / total : 0, Lv = level(a1);
      hud.dot.style.background = ecoCol(a1 ?? 50); hud.next.textContent = `${tt("ahead", { d: ecoFmtD(Math.max(0.05, ahead - pos)) })}: AQI ${a1 ?? "—"} · ${tr(Lv.name)}`;
      hud.rem.textContent = ecoFmtT(remS); hud.km.textContent = `${ecoFmtD(remKm)} ${tt("left")}`; hud.prog.style.width = (pos / total * 100).toFixed(1) + "%";
    }
    const loop = ts => { if (!w.isConnected) return; if (playing && !gpsW) { const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0; pos = Math.min(total, pos + spd0 / 3600 * dt * speed * 10); if (pos >= total) { playing = false; setBtn(); showToast(tt("done")); } update(); } last = ts; raf = requestAnimationFrame(loop); };
    const pb = w.querySelector(".e3-play"), setBtn = () => { pb.innerHTML = playing ? `❚❚ ${esc(tt("pause"))}` : `▶ ${esc(tt("play"))}`; pb.classList.toggle("on", playing); w.querySelectorAll("[data-s]").forEach(b => b.classList.toggle("on", +b.dataset.s === speed)); };
    pb.onclick = () => { if (pos >= total) pos = 0; playing = !playing; last = 0; setBtn(); };
    w.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { speed = +b.dataset.s; setBtn(); });
    w.querySelector(".e3-gps").onclick = e => { const b = e.currentTarget;
      if (gpsW != null) { navigator.geolocation.clearWatch(gpsW); gpsW = null; b.classList.remove("on"); return; }
      if (!navigator.geolocation) return showToast(tt("gpsErr")); playing = false; setBtn(); b.classList.add("on"); showToast(tt("gpsOn"));
      gpsW = navigator.geolocation.watchPosition(p => { const me = [p.coords.latitude, p.coords.longitude]; let bi = 0, bd = 1e9;
        for (let i = 0; i < G.length; i++) { const d = ecoKm(me, G[i]); if (d < bd) { bd = d; bi = i; } } pos = cum[bi]; update(); if (bd > 0.05) showToast(tt("off", { m: Math.round(bd * 1000) })); },
        () => { showToast(tt("gpsErr")); b.classList.remove("on"); gpsW = null; }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }); };
    const close = () => { cancelAnimationFrame(raf); if (gpsW != null) navigator.geolocation.clearWatch(gpsW); m.remove(); w.remove(); document.documentElement.classList.remove("e3-open"); document.removeEventListener("keydown", esc_); };
    const esc_ = e => { if (e.key === "Escape") close(); }; document.addEventListener("keydown", esc_);
    w.querySelector(".e3-x").onclick = close; setBtn(); raf = requestAnimationFrame(loop);
    window.__e3 = { setPos: k => { pos = Math.min(total, k); update(true); }, play: () => { playing = true; setBtn(); }, map: m, close };
  };
})();
