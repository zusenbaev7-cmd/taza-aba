/* «Транспорт и смог» v2: индекс нагрузки дорог (оценка) = структура сети OSM × NO₂ модели CAMS по часам.
 * Почему: сетка CAMS грубая (~40 км в КР), один NO₂ на весь город → все улицы были одного цвета.
 * Индекс различает дороги по классу, полосам, близости к центру и крупным перекрёсткам (OSM), а NO₂ CAMS задаёт общий уровень и суточный ход.
 * Это ОЦЕНКА, не измерение. Измерения (Sensor.Community — PM2.5; станции при наличии ключей) показываются отдельно. */
"use strict";
const TF2_T = {
  ru: { leg: "Индекс нагрузки × NO₂ (оценка)", hour: "Время суток", now: "сейчас", hNote: "NO₂ CAMS: среднее за последние 3 суток в этот час", lo: "низкая", hi: "высокая",
    st: "Дорог из OSM: {n} · индекс 0–100+", only: "Только нагрузка дорог (без NO₂)", noSnap: "Для этого города нет встроенного снимка дорог OSM.", load: "Загрузить дороги из OSM", loading: "Загружаем дороги…", err: "Не удалось загрузить дороги.",
    pClass: "Класс", pLanes: "Полос", pLoad: "Нагрузка (оценка)", pNo2: "NO₂ CAMS ({h})", pIdx: "Индекс", pD: "Район модели",
    cls: { motorway: "автомагистраль", trunk: "магистраль", primary: "главная улица", secondary: "второстепенная", tertiary: "районная" },
    sens: "📡 Измерения: {n} датчиков PM2.5 Sensor.Community", sensNone: "📡 Свежих открытых измерений рядом нет. Открытых измерений NO₂ на улицах в КР нет — поэтому индекс модельный.", sensNo2: "Датчики Sensor.Community меряют частицы PM2.5/PM10, а не NO₂.",
    howH: "Как считается индекс нагрузки", how: "<p><b>Это оценка, а не измерение трафика.</b> Для каждой дороги из OpenStreetMap:</p><ul><li><b>Класс</b> W: автомагистраль 1,0 · магистраль 0,9 · главная 0,75 · второстепенная 0,55 · районная 0,35;</li><li><b>Полосы</b> Ln = 0,7 + 0,15 × полос (от 0,85 до 1,3; если не указано — 1);</li><li><b>Центр</b> C = 0,5 + 0,5 × e<sup>−d/R</sup>, d — расстояние до центра города, R — масштаб города;</li><li><b>Перекрёстки</b> J = 0,8 + 0,4 × min(1, n/6), n — крупные перекрёстки в радиусе 500 м.</li></ul><p>Нагрузка = 100 × W·Ln·C·J / максимум по городу. <b>Индекс = нагрузка × NO₂ / 25</b>, где NO₂ — значение модели CAMS (Open-Meteo) в ближайшем районе в выбранный час, 25 мкг/м³ — суточная норма ВОЗ. Ползунок времени показывает разницу между часом пик и ночью.</p><p>Ограничения: нет данных о реальном потоке машин и пробках; CAMS не различает отдельные улицы. Для реальных пробок можно подключить ключ TomTom (config.js).</p>" },
  ky: { leg: "Жүк индекси × NO₂ (баалоо)", hour: "Сутканын убагы", now: "азыр", hNote: "NO₂ CAMS: акыркы 3 сутканын ушул саатындагы орточосу", lo: "төмөн", hi: "жогору",
    st: "OSMден жолдор: {n} · индекс 0–100+", only: "Жолдордун жүгү гана (NO₂сиз)", noSnap: "Бул шаар үчүн OSM жолдорунун орнотулган сүрөтү жок.", load: "Жолдорду OSMден жүктөө", loading: "Жолдор жүктөлүүдө…", err: "Жолдорду жүктөө мүмкүн болгон жок.",
    pClass: "Классы", pLanes: "Тилкелер", pLoad: "Жүк (баалоо)", pNo2: "NO₂ CAMS ({h})", pIdx: "Индекс", pD: "Моделдин районе",
    cls: { motorway: "автомагистраль", trunk: "магистраль", primary: "башкы көчө", secondary: "экинчи даражалуу", tertiary: "райондук" },
    sens: "📡 Өлчөөлөр: Sensor.Community'нин {n} PM2.5 датчиги", sensNone: "📡 Жакын жерде жаңы ачык өлчөөлөр жок. КРда көчөлөрдөгү NO₂ боюнча ачык өлчөөлөр жок — ошондуктан индекс моделдик.", sensNo2: "Sensor.Community датчиктери NO₂ эмес, PM2.5/PM10 бөлүкчөлөрүн өлчөйт.",
    howH: "Жүк индекси кантип эсептелет", how: "<p><b>Бул баалоо, трафикти өлчөө эмес.</b> OpenStreetMap'тагы ар бир жол үчүн:</p><ul><li><b>Классы</b> W: автомагистраль 1,0 · магистраль 0,9 · башкы 0,75 · экинчи даражалуу 0,55 · райондук 0,35;</li><li><b>Тилкелер</b> Ln = 0,7 + 0,15 × тилке (0,85тен 1,3кө чейин; көрсөтүлбөсө — 1);</li><li><b>Борбор</b> C = 0,5 + 0,5 × e<sup>−d/R</sup>, d — шаардын борборуна чейинки аралык, R — шаардын масштабы;</li><li><b>Кесилиштер</b> J = 0,8 + 0,4 × min(1, n/6), n — 500 м радиустагы ири кесилиштер.</li></ul><p>Жүк = 100 × W·Ln·C·J / шаар боюнча максимум. <b>Индекс = жүк × NO₂ / 25</b>, мында NO₂ — тандалган саатта жакынкы райондогу CAMS моделинин (Open-Meteo) мааниси, 25 мкг/м³ — ДССУнун суткалык ченеми. Убакыт сыдыргычы эң көп каттам саат менен түндүн айырмасын көрсөтөт.</p><p>Чектөөлөр: машинелердин чыныгы агымы жана тыгындар тууралуу маалымат жок; CAMS өзүнчө көчөлөрдү айырмалабайт. Чыныгы тыгындар үчүн TomTom ачкычын кошсо болот (config.js).</p>" },
  en: { leg: "Load index × NO₂ (estimate)", hour: "Time of day", now: "now", hNote: "CAMS NO₂: mean of the last 3 days at this hour", lo: "low", hi: "high",
    st: "Roads from OSM: {n} · index 0–100+", only: "Road load only (without NO₂)", noSnap: "No bundled OSM road snapshot for this city.", load: "Load roads from OSM", loading: "Loading roads…", err: "Couldn't load roads.",
    pClass: "Class", pLanes: "Lanes", pLoad: "Load (estimate)", pNo2: "CAMS NO₂ ({h})", pIdx: "Index", pD: "Model district",
    cls: { motorway: "motorway", trunk: "trunk road", primary: "primary street", secondary: "secondary street", tertiary: "local street" },
    sens: "📡 Measurements: {n} Sensor.Community PM2.5 sensors", sensNone: "📡 No fresh open measurements nearby. There are no open street-level NO₂ measurements in Kyrgyzstan — hence a modelled index.", sensNo2: "Sensor.Community sensors measure PM2.5/PM10 particles, not NO₂.",
    howH: "How the load index is calculated", how: "<p><b>This is an estimate, not a traffic measurement.</b> For every OpenStreetMap road:</p><ul><li><b>Class</b> W: motorway 1.0 · trunk 0.9 · primary 0.75 · secondary 0.55 · tertiary 0.35;</li><li><b>Lanes</b> Ln = 0.7 + 0.15 × lanes (0.85–1.3; 1 if unknown);</li><li><b>Centre</b> C = 0.5 + 0.5 × e<sup>−d/R</sup>, d = distance to the city centre, R = city scale;</li><li><b>Junctions</b> J = 0.8 + 0.4 × min(1, n/6), n = major junctions within 500 m.</li></ul><p>Load = 100 × W·Ln·C·J / city maximum. <b>Index = load × NO₂ / 25</b>, where NO₂ is the CAMS model value (Open-Meteo) in the nearest district at the selected hour and 25 µg/m³ is the WHO 24-hour guideline. The time slider shows rush hour vs night.</p><p>Limits: no real vehicle counts or congestion data; CAMS does not resolve individual streets. Real congestion can be added with a TomTom key (config.js).</p>" },
  tr: { leg: "Yük endeksi × NO₂ (tahmin)", hour: "Günün saati", now: "şimdi", hNote: "CAMS NO₂: son 3 günün bu saatteki ortalaması", lo: "düşük", hi: "yüksek",
    st: "OSM'den yol: {n} · endeks 0–100+", only: "Yalnızca yol yükü (NO₂ olmadan)", noSnap: "Bu şehir için hazır OSM yol verisi yok.", load: "Yolları OSM'den yükle", loading: "Yollar yükleniyor…", err: "Yollar yüklenemedi.",
    pClass: "Sınıf", pLanes: "Şerit", pLoad: "Yük (tahmin)", pNo2: "CAMS NO₂ ({h})", pIdx: "Endeks", pD: "Model semti",
    cls: { motorway: "otoyol", trunk: "ana yol", primary: "birincil cadde", secondary: "ikincil cadde", tertiary: "yerel cadde" },
    sens: "📡 Ölçümler: {n} Sensor.Community PM2.5 sensörü", sensNone: "📡 Yakında güncel açık ölçüm yok. Sokak düzeyinde açık NO₂ ölçümü bulunmadığından endeks modele dayalıdır.", sensNo2: "Sensor.Community sensörleri NO₂ değil, PM2.5/PM10 parçacıklarını ölçer.",
    howH: "Yük endeksi nasıl hesaplanır", how: "<p><b>Bu bir tahmindir, trafik ölçümü değildir.</b> OpenStreetMap'teki her yol için:</p><ul><li><b>Sınıf</b> W: otoyol 1,0 · ana yol 0,9 · birincil 0,75 · ikincil 0,55 · yerel 0,35;</li><li><b>Şerit</b> Ln = 0,7 + 0,15 × şerit (0,85–1,3; bilinmiyorsa 1);</li><li><b>Merkez</b> C = 0,5 + 0,5 × e<sup>−d/R</sup>, d = şehir merkezine uzaklık, R = şehir ölçeği;</li><li><b>Kavşaklar</b> J = 0,8 + 0,4 × min(1, n/6), n = 500 m içindeki büyük kavşaklar.</li></ul><p>Yük = 100 × W·Ln·C·J / şehir azamisi. <b>Endeks = yük × NO₂ / 25</b>; NO₂, seçilen saatte en yakın semtteki CAMS model değeri (Open-Meteo), 25 µg/m³ DSÖ 24 saatlik sınırıdır. Saat kaydırıcısı yoğun saat ile gece farkını gösterir.</p><p>Sınırlar: gerçek araç sayısı ve trafik sıkışıklığı verisi yok; CAMS tek tek sokakları ayırt etmez. Gerçek trafik için TomTom anahtarı eklenebilir (config.js).</p>" },
};
const T2 = (k, v) => { let s = (TF2_T[LANG] || TF2_T.ru)[k]; if (s == null) s = TF2_T.ru[k]; if (v && typeof s === "string") for (const x in v) s = s.split("{" + x + "}").join(v[x]); return s; };
const TF2_W = { motorway: 1, trunk: 0.9, primary: 0.75, secondary: 0.55, tertiary: 0.35 };
const tf2Col = v => v == null ? "#9aa" : v < 15 ? "#2e9e5b" : v < 30 ? "#b5c900" : v < 50 ? "#f2b705" : v < 80 ? "#ff8a3d" : "#e5484d";
const TF2_LEG = [[7, "<15"], [22, "15–30"], [40, "30–50"], [65, "50–80"], [90, "80+"]];
const tf2Km = (a, b) => { const kx = 111.32 * Math.cos(a[0] * Math.PI / 180); return Math.hypot((a[0] - b[0]) * 110.57, (a[1] - b[1]) * kx); };
const tf2Mem = {};
async function tf2Roads() {
  const city = CITY; if (tf2Mem[city]) return tf2Mem[city];
  const j = await ftSnap(); let R, J;
  if (j && j.roads && j.roads.length) { R = j.roads.filter(x => TF2_W[x[0]]).map(([k, n, f, ln]) => ({ k, n, p: unflat(f), ln: ln || 0 })); J = j.jn || null; }
  else { if (!ftLive[city]) throw ftNoSnap();
    const [s, w, n, e] = ftCityBox();
    const o = await ftOverpass(`roads3.${city}`, `[out:json][timeout:90];way[highway~"^(motorway|trunk|primary|secondary|tertiary)$"](${s},${w},${n},${e});out geom tags qt;`);
    R = (o.elements || []).filter(x => x.geometry).map(x => ({ k: x.tags.highway, n: x.tags["name:" + LANG] || x.tags.name || "", ln: parseInt(x.tags.lanes) || 0, p: ftSimplify(x.geometry.map(g => [+g.lat.toFixed(5), +g.lon.toFixed(5)])) })); J = null; }
  if (!J) { const cnt = {}; R.filter(r => r.k !== "tertiary").forEach((r, i) => new Set(r.p.map(p => p[0].toFixed(4) + "," + p[1].toFixed(4))).forEach(k => { (cnt[k] = cnt[k] || new Set()).add(i); }));
    J = Object.keys(cnt).filter(k => cnt[k].size >= 2).map(k => k.split(",").map(Number)); }
  // сетка перекрёстков 0,005° для быстрого подсчёта в радиусе 500 м
  const G = {}; J.forEach(p => { const k = Math.floor(p[0] / 0.005) + ":" + Math.floor(p[1] / 0.005); (G[k] = G[k] || []).push(p); });
  const nearJ = m => { let n = 0; const a = Math.floor(m[0] / 0.005), b = Math.floor(m[1] / 0.005);
    for (let i = -1; i <= 1; i++) for (let k = -1; k <= 1; k++) (G[(a + i) + ":" + (b + k)] || []).forEach(p => { if (tf2Km(m, p) <= 0.5) n++; }); return n; };
  const cc = cityObj().center;
  R.forEach(r => { r.mid = r.p[Math.floor(r.p.length / 2)]; r.dc = tf2Km(r.mid, cc); });
  const ds = R.map(r => r.dc).sort((a, b) => a - b), r90 = ds[Math.floor(ds.length * 0.9)] || 3, Rs = Math.max(1.5, 0.4 * r90);
  R.forEach(r => { const W = TF2_W[r.k] || 0.3, Ln = r.ln > 0 ? Math.max(0.85, Math.min(1.3, 0.7 + 0.15 * r.ln)) : 1, C = 0.5 + 0.5 * Math.exp(-r.dc / Rs);
    r.nj = nearJ(r.mid); const Jf = 0.8 + 0.4 * Math.min(1, r.nj / 6); r.raw = W * Ln * C * Jf; });
  const mx = Math.max(1e-9, ...R.map(r => r.raw)); R.forEach(r => { r.load = 100 * r.raw / mx; r.d = nearestDistrict(r.mid[0], r.mid[1]); });
  return (tf2Mem[city] = R);
}
/* почасовой NO₂ CAMS по районам: «типичные сутки» за 3 дня + текущее значение */
const tf2No2P = {};
function tf2No2() {
  const city = CITY; if (tf2No2P[city] && Date.now() - tf2No2P[city].at < 30 * 60e3) return tf2No2P[city].p;
  const D = DISTRICTS.slice(), parts = []; for (let i = 0; i < D.length; i += 60) parts.push(D.slice(i, i + 60));
  const p = Promise.all(parts.map(pp => fetchJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${pp.map(d => d.lat).join(",")}&longitude=${pp.map(d => d.lon).join(",")}&hourly=nitrogen_dioxide&past_days=3&forecast_days=1&timezone=auto`, 20000)))
    .then(rs => { const arr = rs.flatMap(x => Array.isArray(x) ? x : [x]), out = {}, now = Date.now();
      D.forEach((d, i) => { const r = arr[i]; if (!r || !r.hourly) return; const off = (r.utc_offset_seconds || 0) * 1000, H = r.hourly, prof = Array.from({ length: 24 }, () => []); let cur = null, curT = -1;
        H.time.forEach((tm, k) => { const T = Date.parse(tm + ":00Z") - off, v = H.nitrogen_dioxide[k]; if (v == null || T > now) return; prof[+tm.slice(11, 13)].push(v); if (T > curT) { curT = T; cur = v; } });
        out[d.id] = { prof: prof.map(a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null), cur, hNow: new Date(now + off).getUTCHours() }; });
      return out; });
  tf2No2P[city] = { at: Date.now(), p }; p.catch(() => { delete tf2No2P[city]; }); return p;
}
const tf2Val = (N, d, h) => { const x = N && N[d.id]; if (!x) { const a = air.byDistrict && air.byDistrict[d.id]; return a && a.no2 != null ? a.no2 : null; } return h == null ? x.cur : x.prof[h]; };
function tf2Pop(r, N, h) {
  const v = tf2Val(N, r.d, h), idx = v == null ? null : r.load * v / 25;
  return `<b>${esc(r.n || T2("cls")[r.k] || r.k)}</b><br>${T2("pClass")}: ${esc(T2("cls")[r.k] || r.k)}${r.ln ? ` · ${T2("pLanes")}: ${r.ln}` : ""}<br>${T2("pLoad")}: <b>${fmt(r.load, 0)}</b>/100<br>${T2("pNo2", { h: h == null ? T2("now") : String(h).padStart(2, "0") + ":00" })}: <b>${v == null ? "—" : fmt(v, 0) + " µg/m³"}</b><br>${T2("pIdx")}: <b style="color:${tf2Col(idx)}">${idx == null ? "—" : fmt(idx, 0)}</b><br><small>${T2("pD")}: ${esc(dName(r.d))} · ${T2("leg")}</small>`;
}
function tf2Layer(onState, ctl) {
  const lg = L.layerGroup(); let built = false; const st = { h: null, N: null, lines: [], only: false };
  const paint = () => st.lines.forEach(([pl, r]) => { const v = tf2Val(st.N, r.d, st.h); pl.setStyle({ color: tf2Col(st.only ? r.load : v == null ? null : r.load * v / 25) }); });
  lg.setHour = h => { st.h = h; paint(); }; lg.setOnly = v => { st.only = v; paint(); };
  lg.on("add", async () => { if (built) return; built = true;
    try { const [R, N] = await Promise.all([tf2Roads(), tf2No2().catch(e => { console.warn("no2:", e.message); return null; })]); if (!ftAlive(lg)) { built = false; return; }
      st.N = N; if (ctl) ctl(N);
      R.slice().sort((a, b) => a.load - b.load).forEach(r => { const pl = L.polyline(r.p, { color: "#9aa", weight: r.k === "tertiary" ? 2.5 : /motorway|trunk|primary/.test(r.k) ? 5 : 3.5, opacity: 0.9 })
        .bindPopup(() => tf2Pop(r, st.N, st.h), { maxWidth: 260 }).addTo(lg); st.lines.push([pl, r]); });
      paint(); onState && onState(R.length);
    } catch (e) { built = false; if (e.nosnap) { onState ? onState("nosnap") : toast(T2("noSnap")); } else { console.warn("roads:", e.message); onState ? onState("err") : toast(T2("err")); } } });
  return lg;
}
function tf2Stat(st) { const s = $("#tfStat"); if (!s) return;
  if (typeof st === "number") { s.textContent = "🛣️ " + T2("st", { n: st }); return; }
  s.innerHTML = `${st === "nosnap" ? T2("noSnap") : T2("err")} <button class="btn ghost ft-live" type="button">⬇️ ${T2("load")}</button>`;
  s.querySelector(".ft-live").onclick = () => { ftLive[CITY] = true; s.textContent = T2("loading"); route(true); }; }
function viewTraffic2(el) {
  const d = DISTRICTS.find(x => x.id === state.district) || DISTRICTS[0];
  const sc = air.status === "ok" ? (air.sensors || []).filter(s => s.p2 != null) : [], stn = air.status === "ok" ? (air.stations || []) : [];
  el.innerHTML = `<h1>${FT("tf")}</h1><p class="sub">${FT("tfSub")}</p>
    <div class="map-grid"><div class="map-col"><div id="tfMap" class="mini-map" style="height:400px"></div>
      <div class="tf2-ctl card"><label for="tfH" class="small"><b>${T2("hour")}:</b> <span id="tfHv">${T2("now")}</span></label>
        <input type="range" id="tfH" min="-1" max="23" step="1" value="-1" aria-describedby="tfHn"><div class="small" id="tfShareH" aria-live="polite"></div><div class="small muted" id="tfHn">${T2("hNote")}</div><label class="small tf2-only"><input type="checkbox" id="tfOnly"> ${T2("only")}</label></div>
      <div class="legend tf-leg"><b class="small">${T2("leg")}:</b> ${TF2_LEG.map(([v, l]) => `<span style="background:${tf2Col(v)}">${l}</span>`).join("")}</div>
      <p class="small muted" id="tfStat">${T2("loading")}</p>
      <p class="small muted">${sc.length || stn.length ? esc(T2("sens", { n: sc.length + stn.length })) + " — " + esc(T2("sensNo2")) : esc(T2("sensNone"))}</p>
      <details class="card tf2-how"><summary><b>❓ ${T2("howH")}</b></summary><div class="small">${T2("how")}</div></details>
      <p class="small muted">🛣️ © OpenStreetMap contributors (ODbL) · NO₂: CAMS / Open-Meteo. ${FCFG().TOMTOM_KEY ? "" : "🚦 " + FT("ttKey")}</p></div>
    <div class="list-col"><div class="card tf-card"><div class="row between"><h3 style="margin:0">${FT("estH")}</h3><button class="btn ghost" id="tfHow" type="button">❓ ${FT("how")}</button></div>
      <label for="tfD" class="small">${t("district")}</label><select id="tfD">${districtOptions(d.id)}</select><div id="tfBox"></div></div>
      <div class="card small">📚 ${FT("studies")}: ${ftLink(SRC_LINKS.air2024, "Air 2024")} · ${ftLink(SRC_LINKS.wb2024, "World Bank 2024")} · ${ftLink(SRC_LINKS.undp2023, "UNDP 2023")}</div>
    </div></div><div class="foot">${t("footProto")}</div>`;
  const m = mkMap("tfMap", { zoomControl: true }).setView(cityObj().center, cityObj().zoom || 12); map = m; baseTiles(m);
  const hIn = $("#tfH"), hV = $("#tfHv");
  const L1 = tf2Layer(tf2Stat, N => { const any = N && Object.values(N)[0]; if (any && hIn && hIn.isConnected) hIn.dataset.now = any.hNow; }).addTo(m);
  hIn.oninput = () => { const h = +hIn.value; hV.textContent = h < 0 ? T2("now") : String(h).padStart(2, "0") + ":00"; L1.setHour(h < 0 ? null : h); tsSlider(h < 0 ? null : h); };
  $("#tfOnly").onchange = e => { L1.setOnly(e.target.checked); hIn.disabled = e.target.checked; };
  sc.forEach(s => L.circleMarker([s.lat, s.lon], { radius: 5, color: "#1d4ed8", weight: 1.5, fillColor: "#fff", fillOpacity: 0.9 }).bindPopup(`📡 Sensor.Community<br>PM2.5: <b>${fmt(s.p2, 1)} µg/m³</b>`).addTo(m));
  stn.forEach(s => L.circleMarker([s.lat, s.lon], { radius: 6, color: "#7c3aed", weight: 2, fillColor: "#fff", fillOpacity: 0.9 }).bindPopup(`📡 ${esc(s.name || s.provider || "")}<br>AQI ${Math.round(s.aqi)}`).addTo(m));
  const tt = ttLayer(); if (tt) tt.addTo(m);
  const box = $("#tfBox"); tfCardFill(box, d);
  $("#tfD").onchange = e => { const x = DISTRICTS.find(y => y.id === e.target.value); if (x) { tfCardFill(box, x); m.setView([x.lat, x.lon], Math.max(m.getZoom(), 13)); } };
  $("#tfHow").onclick = tfHowOpen;
  setTimeout(() => { if (m === map && m._mapPane) m.invalidateSize(); }, 60);
}

/* ---------- Единая оценка доли транспорта (карточка, ползунок, панель мэрии) ----------
 * Старая эвристика (features.js) зажимала признаки в [0;1] от фиксированных порогов: зимой при угольном дыме
 * NO₂/PM2.5 < 0,3 и PM2.5/PM10 > 0,8 → все «транспортные» признаки = 0 → 0 % транспорта. Это неверно.
 * Новая модель: базовая доля B по сезону (температуре) + суточный ход NO₂ (трассер выхлопа) относительно PM2.5:
 *   heat = clamp((15 − T) / 20, 0, 1);  B = 30 % − 15 % · heat  (лето ≈ 30 %, сильный мороз ≈ 15 %)
 *   s(h) = B·n / (B·n + 1 − B), n = r(h)·a(h): r — (NO₂/PM2.5)(h) к среднему [0,6; 1,6], a — типовой профиль трафика TS_ACT
 *   s(h) ограничена 10…40 %; показываем диапазон ±5 п.п. Источники: Air 2024 (транспорт 27 % PM2.5 за год, летом до ~30 %),
 *   ПРООН 2023 (транспорт — главный источник NOx), Всемирный банк 2024. Нижняя граница 10 % — консервативный выбор проекта. */
const TS_T = {
  ru: { now: "сейчас", at: "в {h}", day: "в среднем за сутки", range: "≈ {a}–{b} %", lbl: "Транспорт (оценка)", heatL: "Отопление и прочее", est: "Оценка, а не измерение.",
    base: "База по сезону (температура {t})", nf: "NO₂/PM2.5 в этот час / среднее", pf: "Активность трафика (типовой профиль)", floor: "Границы 10–40 %: ниже 10 % не опускаем — транспорт есть всегда, пока улицы заняты.",
    slider: "Вклад транспорта {h} (оценка): {r}", howH: "Как оцениваем долю транспорта",
    how: "<p><b>Это оценка, а не измерение.</b> Мы не знаем точного состава дыма, поэтому опираемся на опубликованные исследования и данные модели CAMS (Open-Meteo) за последние 3 суток:</p><ol><li><b>Сезон.</b> Чем холоднее, тем больше дыма от отопления. База B = 30 % − 15 % × h, где h = (15 °C − средняя температура) / 20, от 0 до 1. Летом B ≈ 30 % (Air 2024: летом транспорт до ~30 % PM2.5), в сильный мороз ≈ 15 %.</li><li><b>Время суток.</b> NO₂ — след выхлопа. Берём отношение NO₂/PM2.5 в этот час к среднему за сутки r (так сокращается разбавление при перемешивании воздуха; вечерняя топка снижает r) и умножаем на типовой суточный профиль городского трафика a (допущение проекта: ночью ≈ 0,3, в часы пик 7–9 и 17–19 ≈ 1,5): n = r·a, s = B·n / (B·n + 1 − B).</li><li><b>Границы.</b> Результат ограничен 10–40 % и показывается диапазоном ±5 п.п. Нижняя граница 10 % — консервативный выбор проекта: по исследованиям транспорт в Бишкеке даёт заметную долю круглый год (27 % PM2.5 за год, Air 2024).</li></ol><p>Та же оценка используется в карточке района, у ползунка времени и в панели для мэрии.</p>",
    src: "Источники" },
  ky: { now: "азыр", at: "саат {h}", day: "сутка боюнча орточо", range: "≈ {a}–{b} %", lbl: "Транспорт (баалоо)", heatL: "Жылытуу жана башкалар", est: "Баалоо, өлчөө эмес.",
    base: "Мезгил боюнча база (температура {t})", nf: "Ушул сааттагы NO₂/PM2.5 / орточо", pf: "Трафиктин активдүүлүгү (типтүү профиль)", floor: "Чектер 10–40 %: 10 %дан төмөн түшүрбөйбүз — көчөлөрдө унаа болгондо транспорт дайыма бар.",
    slider: "Транспорттун үлүшү {h} (баалоо): {r}", howH: "Транспорттун үлүшүн кантип баалайбыз",
    how: "<p><b>Бул баалоо, өлчөө эмес.</b> Түтүндүн так курамын билбейбиз, ошондуктан жарыяланган изилдөөлөргө жана CAMS моделинин (Open-Meteo) акыркы 3 суткалык маалыматына таянабыз:</p><ol><li><b>Мезгил.</b> Канчалык суук болсо, жылытуудан түтүн ошончолук көп. База B = 30 % − 15 % × h, мында h = (15 °C − орточо температура) / 20, 0дөн 1ге чейин. Жайында B ≈ 30 % (Air 2024: жайында транспорт PM2.5тин ~30 %на чейин), катуу суукта ≈ 15 %.</li><li><b>Сутканын убагы.</b> NO₂ — түтүндүн изи. Ушул сааттагы NO₂/PM2.5 катышын сутканын орточосуна бөлөбүз r (абанын аралашуусундагы суюлтуу кыскарат; кечки меш r ди төмөндөтөт) жана шаардык трафиктин типтүү суткалык профилине көбөйтөбүз a (долбоордун божомолу: түнкүсүн ≈ 0,3, 7–9 жана 17–19 сааттарда ≈ 1,5): n = r·a, s = B·n / (B·n + 1 − B).</li><li><b>Чектер.</b> Натыйжа 10–40 % менен чектелет жана ±5 п.п. диапазону менен көрсөтүлөт. 10 % төмөнкү чек — долбоордун этият тандоосу: изилдөөлөр боюнча Бишкекте транспорт жыл бою байкалаарлык үлүш берет (жылына PM2.5тин 27 %, Air 2024).</li></ol><p>Ушул эле баалоо райондун карточкасында, убакыт сыдыргычында жана мэрия панелинде колдонулат.</p>",
    src: "Булактар" },
  en: { now: "now", at: "at {h}", day: "daily average", range: "≈ {a}–{b}%", lbl: "Transport (estimate)", heatL: "Heating & other", est: "An estimate, not a measurement.",
    base: "Seasonal base (temperature {t})", nf: "NO₂/PM2.5 this hour / mean", pf: "Traffic activity (typical profile)", floor: "Bounds 10–40%: never below 10% — traffic is always there while streets are busy.",
    slider: "Transport share {h} (estimate): {r}", howH: "How we estimate the transport share",
    how: "<p><b>This is an estimate, not a measurement.</b> We don't know the exact smoke composition, so we rely on published studies and CAMS model data (Open-Meteo) for the last 3 days:</p><ol><li><b>Season.</b> The colder it is, the more heating smoke. Base B = 30% − 15% × h, where h = (15 °C − mean temperature) / 20, from 0 to 1. In summer B ≈ 30% (Air 2024: transport up to ~30% of PM2.5 in summer), in hard frost ≈ 15%.</li><li><b>Time of day.</b> NO₂ traces exhaust. We take the NO₂/PM2.5 ratio this hour relative to its daily mean r (this cancels dilution by atmospheric mixing; evening stoves lower r) and multiply it by a typical urban traffic profile a (project assumption: ≈ 0.3 at night, ≈ 1.5 at the 7–9 and 17–19 peaks): n = r·a, s = B·n / (B·n + 1 − B).</li><li><b>Bounds.</b> The result is limited to 10–40% and shown as a ±5 pp range. The 10% floor is a conservative project choice: studies show transport is a notable share in Bishkek all year round (27% of annual PM2.5, Air 2024).</li></ol><p>The same estimate is used in the district card, next to the time slider and in the city-hall dashboard.</p>",
    src: "Sources" },
  tr: { now: "şimdi", at: "{h} saatinde", day: "günlük ortalama", range: "≈ %{a}–{b}", lbl: "Ulaşım (tahmin)", heatL: "Isınma ve diğer", est: "Bu bir tahmindir, ölçüm değildir.",
    base: "Mevsim tabanı (sıcaklık {t})", nf: "Bu saatteki NO₂/PM2.5 / ortalama", pf: "Trafik yoğunluğu (tipik profil)", floor: "Sınırlar %10–40: %10'un altına inmez — sokaklar doluyken trafik her zaman vardır.",
    slider: "Ulaşımın payı {h} (tahmin): {r}", howH: "Ulaşımın payını nasıl tahmin ediyoruz",
    how: "<p><b>Bu bir tahmindir, ölçüm değildir.</b> Dumanın tam bileşimini bilmediğimiz için yayımlanmış çalışmalara ve son 3 günün CAMS model verilerine (Open-Meteo) dayanıyoruz:</p><ol><li><b>Mevsim.</b> Hava ne kadar soğuksa ısınma dumanı o kadar fazladır. Taban B = %30 − %15 × h; h = (15 °C − ortalama sıcaklık) / 20, 0 ile 1 arası. Yazın B ≈ %30 (Air 2024: yazın ulaşım PM2.5'in ~%30'una kadar), sert ayazda ≈ %15.</li><li><b>Günün saati.</b> NO₂ egzozun izidir. Bu saatteki NO₂/PM2.5 oranının günlük ortalamaya oranını r alırız (atmosferik karışımın seyreltmesi sadeleşir; akşam sobaları r'yi düşürür) ve tipik kentsel trafik profili a ile çarparız (proje varsayımı: gece ≈ 0,3, 7–9 ve 17–19 zirvelerinde ≈ 1,5): n = r·a, s = B·n / (B·n + 1 − B).</li><li><b>Sınırlar.</b> Sonuç %10–40 ile sınırlıdır ve ±5 puanlık aralıkla gösterilir. %10 alt sınırı projenin temkinli bir seçimidir: çalışmalara göre Bişkek'te ulaşım yıl boyunca kayda değer bir paya sahiptir (yıllık PM2.5'in %27'si, Air 2024).</li></ol><p>Aynı tahmin semt kartında, saat kaydırıcısında ve belediye panelinde kullanılır.</p>",
    src: "Kaynaklar" },
};
const TS = (k, v) => { let s = (TS_T[LANG] || TS_T.ru)[k]; if (s == null) s = TS_T.ru[k]; if (v) for (const x in v) s = s.split("{" + x + "}").join(v[x]); return s; };
/* типовой суточный профиль активности городского трафика (допущение проекта, среднее = 1): ночь низко, пики 7–9 и 17–19 */
const TS_ACT = [0.35, 0.3, 0.3, 0.3, 0.35, 0.5, 0.8, 1.45, 1.55, 1.3, 1.1, 1.05, 1.05, 1.05, 1.1, 1.15, 1.3, 1.5, 1.55, 1.35, 1.05, 0.85, 0.65, 0.45];
const tsCl = (x, a, b) => Math.max(a, Math.min(b, x));
const tsMean = a => { const v = a.filter(x => x != null && isFinite(x)); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
function tsModel(H) {
  const a = H.a.hourly, now = Date.now(), off = H.a.utc_offset_seconds;
  const isPast = tm => off == null ? true : Date.parse(tm + ":00Z") - off * 1000 <= now;   // gov.js передаёт уже прошедшие часы без смещения
  const rows = a.time.map((tm, i) => ({ tm, h: +tm.slice(11, 13), past: isPast(tm), no2: a.nitrogen_dioxide[i], p25: a.pm2_5[i], p10: a.pm10 ? a.pm10[i] : null })).filter(r => r.past && r.no2 != null && r.p25 != null);
  if (rows.length < 12) return null;
  const pN = Array.from({ length: 24 }, (_, h) => tsMean(rows.filter(r => r.h === h).map(r => r.no2))), pP = Array.from({ length: 24 }, (_, h) => tsMean(rows.filter(r => r.h === h).map(r => r.p25)));
  const mN = tsMean(pN), mP = tsMean(pP);
  let temp = null; if (H.b && H.b.hourly) temp = tsMean(H.b.hourly.temperature_2m.filter((v, i) => new Date(H.b.hourly.time[i]).getTime() <= now));
  if (temp == null) { const m = new Date().getMonth(); temp = [-3, -1, 6, 12, 17, 22, 25, 24, 18, 11, 4, -1][m]; }   // нет погоды — климатическая норма по месяцу (ориентир)
  const heat = tsCl((15 - temp) / 20, 0, 1), B = 0.30 - 0.15 * heat;
  // r(h): отношение NO₂/PM2.5 в этот час к среднему (перемешивание атмосферы разбавляет оба газа одинаково и сокращается)
  const rat = Array.from({ length: 24 }, (_, h) => pN[h] != null && pP[h] > 0 ? pN[h] / pP[h] : null), mR = tsMean(rat);
  const nf = h => rat[h] == null || !mR ? 1 : tsCl(rat[h] / mR, 0.6, 1.6), pf = h => TS_ACT[h];
  const share = Array.from({ length: 24 }, (_, h) => { const n = nf(h) * pf(h); return tsCl(B * n / (B * n + (1 - B)), 0.10, 0.40); });
  const hNow = rows[rows.length - 1].h, dayS = tsMean(share);
  const sum = k => rows.reduce((s, r) => s + (r[k] || 0), 0);
  return { share, hNow, B, temp, nf, pf, day: dayS, np: sum("p25") > 0 ? sum("no2") / sum("p25") : null, pp: sum("p10") > 0 ? sum("p25") / sum("p10") : null };
}
const tsRange = s => { const c = Math.round(100 * s); return { c, a: Math.max(10, c - 5), b: Math.min(40, c + 5) }; };
/* совместимый интерфейс для gov.js и старых вызовов */
tfEstimate = function (H) { const M = tsModel(H); if (!M) return null; const tp = Math.round(100 * M.share[M.hNow]);
  return { tp, hp: 100 - tp, day: Math.round(100 * M.day), share: M.share, hNow: M.hNow, R: null, np: M.np, pp: M.pp, temp: M.temp, B: M.B }; };
const tsHr = h => String(h).padStart(2, "0") + ":00";
function tsCardHTML(M, h, d) {
  const hh = h == null ? M.hNow : h, s = M.share[hh], r = tsRange(s), tp = r.c, dr = tsRange(M.day);
  return `<div class="tf-bar" role="img" aria-label="${TS("lbl")} ${tp}%"><span class="tf-t" style="width:${tp}%">${tp}%</span><span class="tf-h" style="width:${100 - tp}%">🔥 ${100 - tp}%</span></div>
    <div class="row between small" style="margin-top:4px"><span>${TS("lbl")}</span><span>${TS("heatL")}</span></div>
    <p style="margin:8px 0 2px"><b>${TS("range", r)}</b> · ${h == null ? TS("now") + " (" + tsHr(hh) + ")" : TS("at", { h: tsHr(hh) })}<br><span class="small">${TS("day")}: ${TS("range", dr)}</span></p>
    <p class="small muted"><b>${TS("est")}</b> ${TS("floor")}</p>
    <ul class="tf-in small"><li>${TS("base", { t: fmt(M.temp, 1) + " °C" })}: <b>${Math.round(100 * M.B)} %</b></li><li>${TS("nf")}: <b>${fmt(M.nf(hh), 2)}</b></li><li>${TS("pf")}: <b>${fmt(M.pf(hh), 2)}</b></li></ul>
    <p class="small muted">${esc(dName(d))} · CAMS / Open-Meteo</p>`;
}
let tsCur = null;   // { M, d } выбранного района — для ползунка
tfCardFill = async function (box, d) {
  box.innerHTML = `<p class="small muted">${FT("loadingH")}</p>`;
  try { const M = tsModel(await tfHourly(d)); if (!box.isConnected) return; if (!M) { box.innerHTML = `<p class="small muted">${FT("noData")}</p>`; return; }
    tsCur = { M, d }; const hIn = document.getElementById("tfH"), h = hIn && +hIn.value >= 0 ? +hIn.value : null;
    box.innerHTML = tsCardHTML(M, h, d); tsSlider(h);
  } catch (e) { box.innerHTML = `<p class="small muted">${FT("noData")} (${esc(e.message)})</p>`; }
};
function tsSlider(h) { const el = document.getElementById("tfShareH"); if (!el || !tsCur) return; const hh = h == null ? tsCur.M.hNow : h;
  el.textContent = TS("slider", { h: h == null ? TS("now") : tsHr(hh), r: TS("range", tsRange(tsCur.M.share[hh])) });
  const box = document.getElementById("tfBox"); if (box && box.querySelector(".tf-bar")) box.innerHTML = tsCardHTML(tsCur.M, h, tsCur.d); }
tfHowOpen = function () {
  const m = $("#modal");
  m.innerHTML = `<div class="sheet tf-how" role="dialog" aria-modal="true" aria-labelledby="tfHH"><h3 id="tfHH">${TS("howH")}</h3>${TS("how")}
    <h4>📚 ${TS("src")}</h4><ul class="small"><li>${esc(FT("st1"))} ${ftLink(SRC_LINKS.air2024, "doi:10.3390/air2040021")}</li><li>${esc(FT("st2"))} ${ftLink(SRC_LINKS.wb2024, "doi:10.1596/41995")}</li><li>${esc(FT("st3"))} ${ftLink(SRC_LINKS.undp2023, "UNDP")}</li></ul>
    <button class="btn" id="tfHClose" type="button" style="width:100%;margin-top:10px">OK</button></div>`;
  m.classList.remove("hidden"); const close = () => m.classList.add("hidden"); m.onclick = e => { if (e.target === m) close(); }; $("#tfHClose").onclick = close; $("#tfHClose").focus();
};

if (typeof FT_ON !== "undefined" && FT_ON.tf) { views.traffic = viewTraffic2; tfLayer = (onState) => tf2Layer(onState); }
