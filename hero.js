/* Витрина «Таза Аба» на главной (v40: по умолчанию; ?hero=0 — выключить, сохраняется; ?hero=1 — включить).
 * Сумеречное небо над горами Ала-Тоо, слой смога, стеклянная карточка с демо-диалогом ИИ-помощника
 * (ответы — из живых данных AQI; без данных — явная пометка «демо»), док разделов. Только CSS/SVG, без видео. */
window.HERO_ON = (() => { try { const q = new URL(location.href).searchParams.get("hero");   // v40: включена по умолчанию; ?hero=0 — выключить (сохраняется), ?hero=1 — снова включить
  if (q === "1") localStorage.removeItem("tazaAba.hero"); if (q === "0") localStorage.setItem("tazaAba.hero", "0");
  return localStorage.getItem("tazaAba.hero") !== "0"; } catch (e) { return true; } })();
const HR_T = {
  ru: { tag: "ИИ-помощник о воздухе", q1: c => `Какой воздух сейчас в ${c}?`, a1: (c, a, lv, n, t) => `Сейчас AQI ${a} — «${lv}». Это медиана по ${n} районам: модель CAMS + датчики. ${t}`,
    q2: "А где чище всего?", a2: (lo, la, hi, ha) => `Чище всего — ${lo} (AQI ${la}). Хуже всего — ${hi} (AQI ${ha}). Подробно — на карте «Дымка».`,
    ph: "Спросите о воздухе…", demo: "демо", live: "живые данные", dock: { map: "Карта смога", advisor: "ИИ-советник", gov: "Для мэрии", alerts: "Уведомления", history: "Архив", news: "Новости", complaints: "Жалобы" }, h: "Чистый воздух начинается с данных", s: "Живой AQI по районам, прогноз смога и советы — бесплатно для каждого." },
  ky: { tag: "Аба боюнча ИИ-жардамчы", q1: c => `${c} азыр аба кандай?`, a1: (c, a, lv, n, t) => `Азыр AQI ${a} — «${lv}». Бул ${n} райондун медианасы: CAMS модели + датчиктер. ${t}`,
    q2: "Эң таза жер кайда?", a2: (lo, la, hi, ha) => `Эң таза — ${lo} (AQI ${la}). Эң начар — ${hi} (AQI ${ha}). Толугураак — «Дымка» картасында.`,
    ph: "Аба жөнүндө сураңыз…", demo: "демо", live: "жандуу маалымат", dock: { map: "Түтүн картасы", advisor: "ИИ-кеңешчи", gov: "Мэрия үчүн", alerts: "Билдирмелер", history: "Архив", news: "Жаңылыктар", complaints: "Даттануулар" }, h: "Таза аба маалыматтан башталат", s: "Райондор боюнча жандуу AQI, түтүн болжолу жана кеңештер — баарына акысыз." },
  en: { tag: "AI air assistant", q1: c => `What's the air like in ${c} right now?`, a1: (c, a, lv, n, t) => `Right now AQI is ${a} — “${lv}”. That's the median of ${n} districts: CAMS model + sensors. ${t}`,
    q2: "Where is it cleanest?", a2: (lo, la, hi, ha) => `Cleanest: ${lo} (AQI ${la}). Worst: ${hi} (AQI ${ha}). Details on the smog map.`,
    ph: "Ask about the air…", demo: "demo", live: "live data", dock: { map: "Smog map", advisor: "AI advisor", gov: "For the city hall", alerts: "Alerts", history: "Archive", news: "News", complaints: "Reports" }, h: "Clean air starts with data", s: "Live AQI by district, smog forecast and advice — free for everyone." },
  tr: { tag: "Hava için yapay zekâ asistanı", q1: c => `${c} şu an hava nasıl?`, a1: (c, a, lv, n, t) => `Şu an AQI ${a} — “${lv}”. ${n} mahallenin medyanı: CAMS modeli + sensörler. ${t}`,
    q2: "En temiz yer neresi?", a2: (lo, la, hi, ha) => `En temiz: ${lo} (AQI ${la}). En kötü: ${hi} (AQI ${ha}). Ayrıntılar duman haritasında.`,
    ph: "Hava hakkında sorun…", demo: "demo", live: "canlı veri", dock: { map: "Duman haritası", advisor: "YZ danışman", gov: "Belediye için", alerts: "Bildirimler", history: "Arşiv", news: "Haberler", complaints: "Şikâyetler" }, h: "Temiz hava veriyle başlar", s: "Mahalle bazında canlı AQI, duman tahmini ve öneriler — herkese ücretsiz." } };
const HT = () => HR_T[LANG] || HR_T.ru;
const HR_GOV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M4 10h16M12 3l8 5H4z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/></svg>';
function hrData() {
  const T = HT(), pts = (typeof DISTRICTS !== "undefined" ? DISTRICTS : []).map(d => ({ d, a: air.byDistrict && air.byDistrict[d.id] && air.byDistrict[d.id].aqi })).filter(p => p.a != null);
  const live = air.status === "ok" && pts.length > 0, c = cityObj();
  const city = LANG === "ru" || LANG === "ky" ? tr(c.prep || c.name) : tr(c.name);
  if (!live) return { live, q1: T.q1(city), a1: T.a1(city, 55, tr(AQI_LEVELS[1].name), 128, tr(AQI_LEVELS[1].title) + "."), q2: T.q2, a2: T.a2("—", "—", "—", "—") };
  const md = Math.round(median(pts.map(p => p.a))), Lv = level(md), s = [...pts].sort((x, y) => x.a - y.a);
  return { live, md, q1: T.q1(city), a1: T.a1(city, md, tr(Lv.name), pts.length, tr(Lv.text)), q2: T.q2, a2: T.a2(dName(s[0].d), s[0].a, dName(s[s.length - 1].d), s[s.length - 1].a) };
}
function hrStars(n, w, h, seed) { let s = seed, r = () => (s = (s * 9301 + 49297) % 233280) / 233280; const o = [];
  for (let i = 0; i < n; i++) o.push(`${Math.round(r() * w)}px ${Math.round(r() * h)}px 0 ${r() < .15 ? 1 : 0}px rgba(255,255,255,${(0.35 + r() * 0.6).toFixed(2)})`); return o.join(","); }
function heroHTML() {
  const T = HT(), D = hrData(), ico = k => (typeof navIco === "function" ? navIco(k) : "");
  const dock = [["#map", "map", ico("map")], ["#advisor", "advisor", ico("advisor")], ["#gov", "gov", HR_GOV], ["#profile/alertsCard", "alerts", ico("alerts")], ["#history", "history", ico("history")], ["#news", "news", ico("news")], ["#complaints", "complaints", ico("complaints")]];
  const smog = D.live ? msBinRGB2(D.md) : "237,180,67";
  return `<section class="hr" aria-label="${esc(T.tag)}" style="--smog:${smog}">
    <div class="hr-sky" aria-hidden="true"><i class="hr-st a" style="box-shadow:${hrStars(70, 1400, 260, 7)}"></i><i class="hr-st b" style="box-shadow:${hrStars(40, 1400, 220, 31)}"></i>
      <svg class="hr-mt" viewBox="0 0 1200 260" preserveAspectRatio="none">
        <defs><linearGradient id="hrM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6b9c"/><stop offset="1" stop-color="#2a3360"/></linearGradient>
          <linearGradient id="hrM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3566"/><stop offset="1" stop-color="#141a3a"/></linearGradient></defs>
        <path fill="url(#hrM1)" d="M0 150 L70 120 L130 135 L210 70 L260 100 L320 55 L380 95 L450 60 L520 105 L600 40 L660 85 L730 60 L800 100 L880 50 L950 95 L1020 70 L1100 110 L1200 80 L1200 260 L0 260Z"/>
        <path fill="#e9eefb" opacity=".85" d="M190 86 L210 70 L228 84 L216 82 L206 90Z M300 68 L320 55 L340 70 L326 68 L314 75Z M430 72 L450 60 L468 74 L455 71 L446 78Z M578 54 L600 40 L622 56 L608 53 L598 61Z M860 62 L880 50 L900 64 L887 61 L876 68Z"/>
        <path fill="url(#hrM2)" d="M0 200 L90 165 L170 185 L260 150 L350 180 L440 155 L530 190 L640 160 L740 190 L840 165 L930 190 L1040 160 L1120 185 L1200 170 L1200 260 L0 260Z"/>
        <g class="hr-lights" fill="#ffd9a0">${Array.from({ length: 46 }, (_, i) => `<circle cx="${(i * 26.3 + (i % 3) * 7) % 1200}" cy="${226 + (i * 13) % 26}" r="${i % 4 ? 1.1 : 1.6}"/>`).join("")}</g>
      </svg><i class="hr-smog"></i><i class="hr-smog b"></i></div>
    <div class="hr-head"><span class="hr-pill"><img src="icons/favicon.svg" alt="" width="16" height="16"> ${esc(T.tag)} · <b class="${D.live ? "live" : "demo"}">${esc(D.live ? T.live : T.demo)}</b></span></div>
    <div class="hr-card" aria-live="off">
      <div class="hr-msgs"><div class="hr-q" data-k="q1"></div><div class="hr-a" data-k="a1"></div><div class="hr-q" data-k="q2"></div><div class="hr-a" data-k="a2"></div></div>
      <a class="hr-in" href="#advisor"><span class="hr-ph">${esc(T.ph)}</span><b class="hr-send" aria-hidden="true">↑</b></a>
      <div class="sr-only">${esc(D.q1)} ${esc(D.a1)} ${esc(D.q2)} ${esc(D.a2)}</div>
    </div>
    <nav class="hr-dock">${dock.map(([h, k, s]) => `<a href="${h}" class="hr-di" aria-label="${esc(T.dock[k])}" data-tip="${esc(T.dock[k])}">${s}</a>`).join("")}</nav>
  </section>`;
}
const msBinRGB2 = a => (typeof msBinRGB === "function" ? msBinRGB(a) : [237, 180, 67]).join(",");
function heroAnim(sec) {
  const D = hrData(), card = sec.querySelector(".hr-card"), slots = [...sec.querySelectorAll("[data-k]")];
  const RM = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
  const fill = () => slots.forEach(s => { s.textContent = D[s.dataset.k]; s.classList.add("on"); });
  if (RM || (typeof LOWEND !== "undefined" && LOWEND && RM)) { fill(); sec.classList.add("still"); return; }
  let vis = true, tmr = 0; const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; }); io.observe(sec);
  const wait = ms => new Promise(r => { const go = () => { if (!sec.isConnected) return; if (!vis || document.hidden) { tmr = setTimeout(go, 400); return; } tmr = setTimeout(r, ms); }; go(); });
  const type = async (s, txt, sp) => { s.classList.add("on", "typing"); s.textContent = ""; for (let i = 0; i < txt.length; i++) { if (!sec.isConnected) return; s.textContent += txt[i]; if (i % 2) await wait(sp); } s.classList.remove("typing"); };
  const run = async () => { while (sec.isConnected) {
    slots.forEach(s => { s.classList.remove("on"); s.textContent = ""; });
    await wait(600); await type(slots[0], D.q1, 28); await wait(500);
    slots[1].classList.add("on", "think"); await wait(900); slots[1].classList.remove("think"); await type(slots[1], D.a1, 14);
    await wait(1400); await type(slots[2], D.q2, 30); await wait(500);
    slots[3].classList.add("on", "think"); await wait(800); slots[3].classList.remove("think"); await type(slots[3], D.a2, 14);
    await wait(5000); } };
  run();
}
function heroMount(el) {
  if (!HERO_ON || el.querySelector(".hr")) return;
  document.documentElement.classList.add("hero-on");
  /* всегда ПОСЛЕ главной карточки AQI (она — первое, что видно), до второстепенных блоков */
  const h = el.querySelector(".hero"), html = heroHTML();
  if (h) h.insertAdjacentHTML("afterend", html); else el.insertAdjacentHTML("beforeend", html);
  heroAnim(el.querySelector(".hr"));
}
if (typeof views !== "undefined" && HERO_ON) { const _h = views.home; views.home = el => { _h(el); try { heroMount(el); } catch (e) { console.warn("hero:", e); } }; }
if (HERO_ON) { const v = document.getElementById("view"); if (v && v.classList.contains("v-home")) try { heroMount(v); } catch (e) {} }
