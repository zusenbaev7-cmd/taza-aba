/* Общие линейные SVG-иконки для боковой панели и сетки «Ещё» (без emoji — нет «тофу» на Windows/iOS). */
"use strict";
const NAV_ICO = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  advisor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/></svg>',
  news: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h13v14H6a2 2 0 0 1-2-2V5z"/><path d="M17 9h3v8a2 2 0 0 1-2 2"/><path d="M7 9h7M7 13h7M7 16h4"/></svg>',
  more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
  house: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  group: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M2.5 19c1.2-3.2 3.5-4.8 6.5-4.8S14.3 15.8 15.5 19"/><path d="M14 14.2c1.6-.4 3.1-.2 4.5.8 1 .7 1.7 1.8 2 3"/></svg>',
  routes: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 7.5c2.5 1 4 3.2 4.3 5.8.3 2.2 1.5 4 3.5 5"/></svg>',
  complaints: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v12H5z"/><circle cx="12" cy="13" r="3.2"/><path d="M9 7 10.2 5h3.6L15 7"/></svg>',
  weather: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="9" r="3.2"/><path d="M10 3.5V5M10 13v1.5M4.5 9H6M14 9h1.5M6.2 5.2 7.3 6.3M12.7 11.7l1.1 1.1"/><path d="M8 16.5h8.5a3.5 3.5 0 1 0-.4-7"/></svg>',
  history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="M7 15l3.5-4 2.5 2.5L17 8"/></svg>',
  schools: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10 12 5l9 5-9 5-9-5z"/><path d="M7 12.2V17c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.8"/></svg>',
  profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.4-3.5 3.8-5.2 7-5.2S17.6 15.5 19 19"/></svg>',
  alerts: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10a5 5 0 0 1 10 0v4l1.5 2.5H5.5L7 14z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  cleanair: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14.5c0-2 1.5-3.5 3.5-3.5h.3A4.2 4.2 0 0 1 16 9.5 3.5 3.5 0 0 1 20 13.5c0 .3 0 .6-.1.9"/><path d="M5 17.5h11M7.5 20h8"/></svg>',
  traffic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="3" width="8" height="18" rx="3"/><circle cx="12" cy="8" r="1.6"/><circle cx="12" cy="12.5" r="1.6"/><circle cx="12" cy="17" r="1.6"/></svg>',
  trees: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-7"/><path d="M7 14c0-3.5 2.2-6 5-7.5C14.8 8 17 10.5 17 14c-1.6 0-3 .7-5 2-2-1.3-3.4-2-5-2z"/><path d="M9 10.5c.5-2 1.7-3.5 3-4.5 1.3 1 2.5 2.5 3 4.5"/></svg>',
};
const navIco = k => NAV_ICO[k] || NAV_ICO.more;
