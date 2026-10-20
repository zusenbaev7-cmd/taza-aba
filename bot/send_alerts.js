#!/usr/bin/env node
/**
 * Рассылка смог-алертов. Читает bot/subscribers.json + координаты районов из kg-places.js/data.js,
 * запрашивает Open-Meteo Air Quality, шлёт в Telegram при AQI ≥ порога.
 * Без TELEGRAM_BOT_TOKEN или при DRY_RUN=1 — только отчёт, без sendMessage.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const DRY = process.env.DRY_RUN === "1" || !TOKEN;
const SUB_PATH = path.join(__dirname, "subscribers.json");

function loadDistricts() {
  // Минимальный eval оболочки: только данные городов (без DOM).
  const vm = require("vm");
  const ctx = { console, RegExp, Math, Object, Array, JSON, Map, Set, parseInt, parseFloat, isNaN, undefined };
  vm.createContext(ctx);
  const wrap = s => fs.readFileSync(path.join(ROOT, s), "utf8");
  // i18n/LANG stubs
  vm.runInContext('var LANG="ru"; var I18N={ru:{},ky:{},en:{},tr:{}}; function t(k){return k;} function tr(o){return o&&(o.ru||o.en||o);}', ctx);
  vm.runInContext(wrap("data.js"), ctx);
  try { vm.runInContext(wrap("kg-places.js"), ctx); } catch (e) { console.warn("kg-places:", e.message); }
  const out = {};
  for (const [cid, c] of Object.entries(ctx.CITIES || {})) {
    for (const d of c.districts || []) out[d.id] = { city: cid, id: d.id, lat: d.lat, lon: d.lon, name: d.name };
  }
  return out;
}

async function aqi(lat, lon) {
  const u = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=auto`;
  const r = await fetch(u);
  if (!r.ok) throw new Error("Open-Meteo HTTP " + r.status);
  const j = await r.json();
  return { aqi: j.current && j.current.us_aqi, pm25: j.current && j.current.pm2_5 };
}

async function tg(method, body) {
  if (DRY) { console.log("[dry]", method, JSON.stringify(body).slice(0, 200)); return { ok: true, dry: true }; }
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(method + ": " + (j.description || r.status));
  return j;
}

const MSG = {
  ru: (n, a, p) => `⚠️ Смог в «${n}»: US AQI ${a}${p != null ? `, PM2.5 ${Math.round(p)} µg/m³` : ""}.\nОткройте карту: https://taza-aba.surge.sh/#map\n/stop — отписаться`,
  ky: (n, a, p) => `⚠️ «${n}» аймагында смог: US AQI ${a}${p != null ? `, PM2.5 ${Math.round(p)} µg/m³` : ""}.\nКарта: https://taza-aba.surge.sh/#map\n/stop — жазылууну токтотуу`,
  en: (n, a, p) => `⚠️ Smog in “${n}”: US AQI ${a}${p != null ? `, PM2.5 ${Math.round(p)} µg/m³` : ""}.\nMap: https://taza-aba.surge.sh/#map\n/stop to unsubscribe`,
  tr: (n, a, p) => `⚠️ “${n}” semtinde duman: US AQI ${a}${p != null ? `, PM2.5 ${Math.round(p)} µg/m³` : ""}.\nHarita: https://taza-aba.surge.sh/#map\n/stop — abonelikten çık`,
};

(async () => {
  const sub = JSON.parse(fs.readFileSync(SUB_PATH, "utf8"));
  const list = sub.subscribers || [];
  console.log("subscribers", list.length, "dry", DRY);
  if (!list.length) { console.log("nothing to do"); return; }
  const D = loadDistricts();
  const cache = {};
  let sent = 0;
  for (const s of list) {
    const d = D[s.district];
    if (!d) { console.warn("unknown district", s.district); continue; }
    const key = d.lat.toFixed(3) + "," + d.lon.toFixed(3);
    if (!cache[key]) cache[key] = await aqi(d.lat, d.lon);
    const { aqi: a, pm25 } = cache[key];
    const thr = s.threshold != null ? s.threshold : (sub.defaultThreshold || 100);
    if (a == null || a < thr) { console.log("skip", s.chat_id, d.id, a, "<", thr); continue; }
    const lang = MSG[s.lang] ? s.lang : "ru";
    const name = (d.name && (d.name[lang] || d.name.ru || d.name.en)) || d.id;
    await tg("sendMessage", { chat_id: s.chat_id, text: MSG[lang](name, a, pm25), disable_web_page_preview: true });
    sent++;
  }
  console.log("sent", sent);
})().catch(e => { console.error(e); process.exit(1); });
