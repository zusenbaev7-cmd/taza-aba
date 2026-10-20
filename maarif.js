/* Таза Аба — школы фонда Türkiye Maarif Vakfı (TMV) на карте.
 * Источники (проверено 19.10.2026): официальный список TMV https://turkiyemaarif.org/dunyada-maarif ,
 * страницы школ https://sapat.edu.kg/page/... , https://kg.maarifschools.org/page/hakkimizda ,
 * новость TMV о передаче SAPAT (31.12.2024), EduPage-сайты лицеев. Координаты — OpenStreetMap/Nominatim.
 * prec: "exact" — найден сам объект/дом в OSM; "street" — найдена улица; "city" — адрес не опубликован, точка в городе. */
"use strict";
const MF_SRC_LIST = "https://turkiyemaarif.org/dunyada-maarif";
const MF_SAPAT = p => "https://sapat.edu.kg/page/" + p;
const MF_DATE = "19.10.2026";
const MF_CITY = {
  bishkek: { ru: "Бишкек", ky: "Бишкек", en: "Bishkek", tr: "Bişkek" }, osh: { ru: "Ош", ky: "Ош", en: "Osh", tr: "Oş" },
  jalal: { ru: "Джалал-Абад", ky: "Жалал-Абад", en: "Jalal-Abad", tr: "Celalabad" }, karakol: { ru: "Каракол", ky: "Каракол", en: "Karakol", tr: "Karakol" },
  naryn: { ru: "Нарын", ky: "Нарын", en: "Naryn", tr: "Narın" }, talas: { ru: "Талас", ky: "Талас", en: "Talas", tr: "Talas" },
  tokmok: { ru: "Токмок", ky: "Токмок", en: "Tokmok", tr: "Tokmok" }, karabalta: { ru: "Кара-Балта", ky: "Кара-Балта", en: "Kara-Balta", tr: "Kara-Balta" },
  choktal: { ru: "Чок-Тал (Иссык-Куль)", ky: "Чок-Тал (Ысык-Көл)", en: "Chok-Tal (Issyk-Kul)", tr: "Çok-Tal (Issık Göl)" },
  kyzylkiya: { ru: "Кызыл-Кия", ky: "Кызыл-Кыя", en: "Kyzyl-Kiya", tr: "Kızıl-Kıya" }, kadamjay: { ru: "Кадамжай", ky: "Кадамжай", en: "Kadamjay", tr: "Kadamcay" },
  istanbul: { ru: "Стамбул", ky: "Стамбул", en: "Istanbul", tr: "İstanbul" }, ankara: { ru: "Анкара", ky: "Анкара", en: "Ankara", tr: "Ankara" },
};
/* lvl: k12 | primary | lyceum | univ | hq ; g: boys | girls (по названию страницы «Erkek/Kız Lisesi»); langs4 — кырг./рус./англ./тур. */
const MAARIF = [
  { id: "mek", c: "kg", city: "bishkek", name: "Maarif Eğitim Kompleksi / Маариф билим берүү комплекси", lvl: "k12", addr: "пр. Аалы Токомбаева, 9/1", lat: 42.81539, lon: 74.62665, prec: "exact",
    since: "15.09.2021", first: true, tel: "+996 504 880 102", web: "https://kg.maarifschools.org/", src: "https://kg.maarifschools.org/page/hakkimizda" },
  { id: "uwis", c: "kg", city: "bishkek", name: "SAPAT UEK United World International School (UWIS)", lvl: "k12", addr: "ул. А. Масалиева, 26", lat: 42.85343, lon: 74.54395, prec: "street",
    since: "2014", cambridge: true, tel: "+996 559 932 222", web: "https://kg.maarifschools.org/", src: MF_SAPAT("united-world-international-school") },
  { id: "aichurek", c: "kg", city: "bishkek", name: "SAPAT UEK Ayçürek Lisesi (Айчүрөк)", lvl: "lyceum", g: "girls", addr: "мкр Аламедин-1, 62/1", lat: 42.87777, lon: 74.68791, prec: "exact",
    since: "01.10.1993", grades: "7–11", langs4: true, tel: "+996 777 894 157", web: "https://aichurok.edupage.org/", src: MF_SAPAT("aycurok-lisesi") },
  { id: "aitmatov", c: "kg", city: "bishkek", name: "SAPAT UEK Cengiz Aytmatov Lisesi (Чынгыз Айтматов)", lvl: "lyceum", g: "boys", addr: "ул. Широкая, 1А", lat: 42.91950, lon: 74.61704, prec: "exact",
    since: "01.09.1992", grades: "7–11", langs4: true, tel: "+996 999 998 972", web: "https://kg.maarifschools.org/", src: MF_SAPAT("cengiz-aytmatov-erkek-lisesi") },
  { id: "seitek", c: "kg", city: "bishkek", name: "SAPAT UEK Seytek Okulu (Сейтек)", lvl: "primary", addr: "ул. Анкара, 15", lat: 42.8586, lon: 74.6762, prec: "street",
    since: "01.09.2012", grades: "1–6", langs4: true, tel: "+996 999 975 004", web: "https://kg.maarifschools.org/", src: MF_SAPAT("seytek-tonguc") },
  { id: "akyltai", c: "kg", city: "bishkek", name: "SAPAT UEK Akıltay Altın Muras İlkokulu (Акылтай)", lvl: "primary", addr: null, lat: 42.8700, lon: 74.5900, prec: "city",
    tel: "+996 702 102 050", web: "https://kg.maarifschools.org/", src: MF_SRC_LIST },
  { id: "alatoo", c: "kg", city: "bishkek", name: "Ala-Too Uluslararası Üniversitesi / Международный университет Ала-Тоо", lvl: "univ", addr: "ул. Анкара, Кырман (Тунгуч)", lat: 42.85661, lon: 74.68080, prec: "exact",
    students: 3850, tel: "+996 312 631 425", web: "https://alatoo.edu.kg/", src: "https://turkiyemaarif.org/news/kirgizistandaki-sapat-okullari-turkiye-maarif-vakfina-devredildi" },
  { id: "jayil", c: "kg", city: "karabalta", name: "SAPAT UEK Cayıl Baatır Lisesi (Жайыл Баатыр)", lvl: "lyceum", g: "boys", addr: null, lat: 42.8011, lon: 73.8523, prec: "city",
    tel: "+996 555 272 927", web: "https://kg.maarifschools.org/", src: MF_SAPAT("cayilbatir-erkek-lisesi") },
  { id: "kurmanjan", c: "kg", city: "osh", name: "SAPAT UEK Kurmancan Datka Lisesi (Курманжан Датка)", lvl: "lyceum", g: "girls", addr: null, lat: 40.5205, lon: 72.8010, prec: "city",
    tel: "+996 777 031 151", web: "https://kg.maarifschools.org/", src: MF_SAPAT("kurmancan-datka-kiz-lisesi") },
  { id: "alymbek", c: "kg", city: "osh", name: "SAPAT UEK Alımbek Datka Lisesi (Алымбек Датка)", lvl: "lyceum", g: "boys", addr: null, lat: 40.5140, lon: 72.8100, prec: "city",
    tel: "+996 557 222 673", web: "https://kg.maarifschools.org/", src: MF_SAPAT("alimbek-datka-erkek-lisesi") },
  { id: "kurmanbek", c: "kg", city: "jalal", name: "SAPAT UEK Kurmanbek Baatır Lisesi (Курманбек Баатыр)", lvl: "lyceum", g: "boys", addr: "ул. Островского, 117", lat: 40.93383, lon: 72.99107, prec: "street",
    tel: "+996 776 023 685", web: "https://kurmanbek-baatyr.edupage.org/", src: MF_SAPAT("manas-kurmanbek-batir-erkek-lisesi") },
  { id: "zuura", c: "kg", city: "jalal", name: "SAPAT UEK Zuura Nurmatova Lisesi (Зуура Нурматова)", lvl: "lyceum", g: "girls", addr: null, lat: 40.9400, lon: 73.0050, prec: "city",
    tel: "+996 997 007 494", web: "https://kg.maarifschools.org/", src: MF_SAPAT("manas-zuura-nurmatova-kiz-lisesi") },
  { id: "karasaev", c: "kg", city: "karakol", name: "SAPAT UEK Hüseyin Karasayev Lisesi (Х. Карасаев)", lvl: "lyceum", addr: "ул. Тыныстанова, 28", lat: 42.49671, lon: 78.40795, prec: "street",
    since: "01.09.1992", grades: "7–11", langs4: true, tel: "+996 505 774 848", web: "https://kg.maarifschools.org/", src: MF_SAPAT("h-karasaev-lisesi") },
  { id: "bektenov", c: "kg", city: "choktal", name: "SAPAT UEK Ziyaş Bektenov Lisesi (Зыяш Бектенов)", lvl: "lyceum", g: "girls", addr: "с. Чок-Тал, Иссык-Кульская обл.", lat: 42.58953, lon: 76.74093, prec: "city",
    since: "05.11.2004", grades: "7–11", langs4: true, tel: "+996 995 952 299", web: "https://kg.maarifschools.org/", src: MF_SAPAT("ziyas-bektenov-kiz-lisesi") },
  { id: "balasagyn", c: "kg", city: "tokmok", name: "SAPAT UEK Yusuf Balasagun Lisesi (Жусуп Баласагын)", lvl: "lyceum", g: "boys", addr: null, lat: 42.8420, lon: 75.2900, prec: "city",
    tel: "+996 990 994 994", web: "https://kg.maarifschools.org/", src: MF_SAPAT("yusuf-balasagun-erkek-lisesi") },
  { id: "umut", c: "kg", city: "tokmok", name: "SAPAT UEK Umut Lisesi (Үмүт)", lvl: "lyceum", g: "girls", addr: "ул. 50 лет Киргизии, промзона", lat: 42.8300, lon: 75.3050, prec: "city",
    since: "01.09.2014", grades: "7–11", langs4: true, tel: "+996 501 366 266", web: "https://kg.maarifschools.org/", src: MF_SAPAT("umut-kiz-lisesi") },
  { id: "manasata", c: "kg", city: "talas", name: "SAPAT UEK Manas Ata Lisesi (Манас Ата)", lvl: "lyceum", g: "boys", addr: null, lat: 42.5250, lon: 72.2420, prec: "city",
    tel: "+996 550 551 259", web: "https://kg.maarifschools.org/", src: MF_SAPAT("manas-ata-erkek-lisesi") },
  { id: "meerim", c: "kg", city: "talas", name: "SAPAT UEK Meerim Lisesi (Мээрим)", lvl: "lyceum", g: "girls", addr: null, lat: 42.5190, lon: 72.2540, prec: "city",
    tel: "+996 702 751 058", web: "https://kg.maarifschools.org/", src: MF_SAPAT("meerim-kiz-lisesi") },
  { id: "subakojoev", c: "kg", city: "naryn", name: "SAPAT UEK Muratbek Subakojoev Lisesi (Муратбек Субакожоев)", lvl: "lyceum", addr: null, lat: 41.4286, lon: 75.9976, prec: "city",
    tel: "+996 507 767 525", web: "https://kg.maarifschools.org/", src: MF_SAPAT("muratbek-subakojoev") },
  { id: "razzakov", c: "kg", city: "kyzylkiya", name: "SAPAT UEK İshak Razzakov Lisesi (Исхак Раззаков)", lvl: "lyceum", g: "boys", addr: null, lat: 40.2538, lon: 72.1308, prec: "city",
    tel: "+996 779 101 494", web: "https://kg.maarifschools.org/", src: MF_SAPAT("ishak-razzakov-erkek-lisesi") },
  { id: "semetey", c: "kg", city: "kadamjay", name: "SAPAT UEK Semetey Lisesi (Семетей)", lvl: "lyceum", addr: "ул. Северная, 8", lat: 40.12855, lon: 71.72959, prec: "street",
    since: "10.1993", grades: "7–11", langs4: true, tel: "+996 774 807 074", web: "https://kg.maarifschools.org/", src: MF_SAPAT("semetey-lisesi") },
  { id: "tmvhq", c: "tr", city: "istanbul", name: "Türkiye Maarif Vakfı — Genel Merkez", lvl: "hq", addr: "Altunizade Mah., Ord. Prof. Dr. Fahrettin Kerim Gökay Cad. No: 22, Üsküdar", lat: 41.02103, lon: 29.04370, prec: "street",
    tel: "+90 216 323 35 35", web: "https://turkiyemaarif.org/", src: MF_SRC_LIST },
  { id: "tmvank", c: "tr", city: "ankara", name: "Türkiye Maarif Vakfı — Ankara", lvl: "office", addr: "Kızılırmak Mah. 1443. Cad. No: 25, Usta Plaza B Blok, Çukurambar, Çankaya", lat: 39.90981, lon: 32.80790, prec: "street",
    tel: "+90 312 285 53 97", web: "https://turkiyemaarif.org/", src: "https://mts.turkiyemaarif.org/contact" },
];

/* Реальные фото — только со страницы ЭТОЙ школы (sapat.edu.kg/page/<школа>, блок фото страницы). Нет фото → эмблема-заглушка. */
const MF_PHOTO = {
  aichurek: MF_SAPAT("aycurok-lisesi"), aitmatov: MF_SAPAT("cengiz-aytmatov-erkek-lisesi"), karasaev: MF_SAPAT("h-karasaev-lisesi"),
  mek: "https://kg.maarifschools.org/", alatoo: "https://commons.wikimedia.org/wiki/File:Main_campus_of_IAAU.JPG",
  semetey: MF_SAPAT("semetey-lisesi"), uwis: MF_SAPAT("united-world-international-school"), bektenov: MF_SAPAT("ziyas-bektenov-kiz-lisesi"),
};
const MF_PHOTO_BY = { alatoo: "Nataev, CC BY-SA 3.0, Wikimedia Commons" };
const MF_EMB = "icons/maarif-emblem.png";
const MF_T = {
  ru: { titleW: "Школы Маариф по всему миру", subW: "Учебные заведения фонда Türkiye Maarif Vakfı на карте мира", offH: "Официальные данные TMV (на {d})", o_countries: "стран", o_inst: "учебных учреждений", o_schools: "школ", o_students: "учащихся", o_univ2: "университета", o_trc: "центров тюркологии (TAM)", o_edc: "образовательных центров", o_dorm: "общежитий",
    offNote: "на карте — {n} объектов в {c} странах из публичного списка фонда; остальные TMV не публикует по адресам", searchW: "Поиск: школа, город или страна", country: "Страна", allCtr: "Все страны", stat: "Страны: <b>{c}</b> · Объекты: <b>{n}</b>",
    mapHintW: "Цифра в кружке — несколько объектов рядом, нажмите, чтобы приблизить", approx: "≈ примерно (по городу)", clLeg: "группа объектов", clTip: "{n} объектов — приблизить",
    noteW: "Список объектов — официальный «Kurum Listesi» фонда TMV (на {d}); повторы одного кампуса убраны. Кыргызстан — сайты sapat.edu.kg и kg.maarifschools.org. Координаты — OpenStreetMap; «≈» означает точку по городу или улице. Фото — только с официальных сайтов этих школ; где реального фото нет — эмблема.",
    ctryOnly: "В этой стране фонд публикует только офис или центр — список школ уточняется.", school: "Школа", kinder: "Детский сад", center: "Образовательный центр",
    r_asia: "Азия", r_africa: "Африка", r_europe: "Европа", r_mideast: "Ближний Восток", r_america: "Америка", r_oceania: "Океания",
    noPhoto: "Фото пока нет", photo: "Фото", emblem: "Эмблема © Türkiye Maarif Vakfı", office: "Офис фонда (не школа)", mapHint: "Нажмите на школу в списке — карта покажет её", title: "Школы Маариф", sub: "Учебные заведения фонда Türkiye Maarif Vakfı и воздух рядом с ними", layer: "🏫 Школы Маариф", moreSub: "Карта, адреса и воздух у школ",
    k12: "Детсад + школа (K-12)", primary: "Начальная школа", lyceum: "Лицей", univ: "Университет", hq: "Штаб-квартира фонда (не школа)",
    exact: "точный адрес", street: "адрес ≈ улица", city: "≈ примерно, город", noAddr: "адрес не опубликован", since: "работает с {d}", first: "первая школа TMV в КР",
    grades: "{g} классы", langs4: "обучение на кыргызском, русском, английском и турецком", boys: "лицей для мальчиков", girls: "лицей для девочек", cambridge: "программы Cambridge (IGCSE, A Levels)",
    students: "≈{n} студентов", route: "📍 Маршрут", site: "Сайт", src: "Источник", aqiNear: "Воздух у школы", search: "Поиск: название или город", all: "Все",
    count: "{n} учреждений", kg: "🇰🇬 Кыргызстан", tr: "🇹🇷 Турция", allList: "Все школы →",
    trNote: "TMV открывает школы за рубежом: по закону № 6721 он не ведёт учебную деятельность внутри Турции (кроме подготовки учителей). В Турции — только офисы фонда: штаб-квартира в Стамбуле и офис в Анкаре.",
    note: "Данные из открытых источников: официальный список TMV, сайты sapat.edu.kg и kg.maarifschools.org (на {d}). В КР в 2024 году фонду переданы лицеи SAPAT. Точки «≈» стоят по городу или улице — уточняйте адрес по телефону.", nothing: "Ничего не найдено" },
  ky: { titleW: "Дүйнө жүзүндөгү Маариф мектептери", subW: "Türkiye Maarif Vakfı фондунун окуу жайлары дүйнө картасында", offH: "TMVнын расмий маалыматы ({d} карата)", o_countries: "өлкө", o_inst: "окуу мекемеси", o_schools: "мектеп", o_students: "окуучу", o_univ2: "университет", o_trc: "түркология борбору (TAM)", o_edc: "билим берүү борбору", o_dorm: "жатакана",
    offNote: "картада фонддун ачык тизмесинен {c} өлкөдөгү {n} объект; калгандарынын даректерин TMV жарыялабайт", searchW: "Издөө: мектеп, шаар же өлкө", country: "Өлкө", allCtr: "Бардык өлкөлөр", stat: "Өлкөлөр: <b>{c}</b> · Объекттер: <b>{n}</b>",
    mapHintW: "Тегерек ичиндеги сан — жакын жайгашкан бир нече объект, жакындатуу үчүн басыңыз", approx: "≈ болжолдуу (шаар боюнча)", clLeg: "объекттер тобу", clTip: "{n} объект — жакындатуу",
    noteW: "Объекттердин тизмеси — TMV фондунун расмий «Kurum Listesi» ({d} карата); бир кампустун кайталоолору алынып салынды. Кыргызстан — sapat.edu.kg жана kg.maarifschools.org. Координаттар — OpenStreetMap; «≈» — шаар же көчө боюнча чекит. Сүрөттөр — ушул мектептердин расмий сайттарынан гана; чыныгы сүрөт жок болсо — эмблема.",
    ctryOnly: "Бул өлкөдө фонд кеңсесин же борборун гана жарыялайт — мектептердин тизмеси такталууда.", school: "Мектеп", kinder: "Бала бакча", center: "Билим берүү борбору",
    r_asia: "Азия", r_africa: "Африка", r_europe: "Европа", r_mideast: "Жакынкы Чыгыш", r_america: "Америка", r_oceania: "Океания",
    noPhoto: "Сүрөт азырынча жок", photo: "Сүрөт", emblem: "Эмблема © Türkiye Maarif Vakfı", office: "Фонддун кеңсеси (мектеп эмес)", mapHint: "Тизмеден мектепти басыңыз — карта аны көрсөтөт", title: "Маариф мектептери", sub: "Türkiye Maarif Vakfı фондунун окуу жайлары жана алардын жанындагы аба", layer: "🏫 Маариф мектептери", moreSub: "Карта, даректер жана мектеп жанындагы аба",
    k12: "Бала бакча + мектеп (K-12)", primary: "Башталгыч мектеп", lyceum: "Лицей", univ: "Университет", hq: "Фонддун башкы кеңсеси (мектеп эмес)",
    exact: "так дарек", street: "дарек ≈ көчө", city: "≈ болжолдуу, шаар", noAddr: "дарек жарыяланган эмес", since: "{d} бери иштейт", first: "КРдагы TMVнын биринчи мектеби",
    grades: "{g}-класстар", langs4: "кыргыз, орус, англис жана түрк тилдеринде окутуу", boys: "балдар лицейи", girls: "кыздар лицейи", cambridge: "Cambridge программалары (IGCSE, A Levels)",
    students: "≈{n} студент", route: "📍 Маршрут", site: "Сайт", src: "Булак", aqiNear: "Мектеп жанындагы аба", search: "Издөө: аталышы же шаар", all: "Баары",
    count: "{n} мекеме", kg: "🇰🇬 Кыргызстан", tr: "🇹🇷 Түркия", allList: "Бардык мектептер →",
    trNote: "TMV мектептерди чет өлкөлөрдө ачат: № 6721 мыйзам боюнча Түркиянын ичинде окутуу иштерин жүргүзбөйт (мугалимдерди даярдоодон тышкары). Түркияда фонддун кеңселери гана бар: Стамбулдагы башкы кеңсе жана Анкарадагы кеңсе.",
    note: "Ачык булактардан алынган маалымат: TMVнын расмий тизмеси, sapat.edu.kg жана kg.maarifschools.org ({d} карата). 2024-жылы фондго SAPAT лицейлери өткөрүлүп берилген. «≈» белгиси шаар же көчө боюнча — даректи телефон аркылуу тактаңыз.", nothing: "Эч нерсе табылган жок" },
  en: { titleW: "Maarif schools worldwide", subW: "Türkiye Maarif Vakfı institutions on a world map", offH: "Official TMV figures (as of {d})", o_countries: "countries", o_inst: "institutions", o_schools: "schools", o_students: "students", o_univ2: "universities", o_trc: "Türkiye research centres", o_edc: "education centres", o_dorm: "dormitories",
    offNote: "the map shows {n} sites in {c} countries from the foundation's public list; TMV does not publish addresses for the rest", searchW: "Search: school, city or country", country: "Country", allCtr: "All countries", stat: "Countries: <b>{c}</b> · Sites: <b>{n}</b>",
    mapHintW: "A number in a circle means several sites close together — tap to zoom in", approx: "≈ approximate (city)", clLeg: "group of sites", clTip: "{n} sites — zoom in",
    noteW: "Sites come from TMV's official “Kurum Listesi” (as of {d}); duplicate entries for the same campus were removed. Kyrgyzstan: sapat.edu.kg and kg.maarifschools.org. Coordinates: OpenStreetMap; “≈” means the pin is placed by city or street. Photos are only from these schools' official sites; where there is no real photo, the emblem is shown.",
    ctryOnly: "Here the foundation lists only an office or centre — the school list is still being checked.", school: "School", kinder: "Kindergarten", center: "Education centre",
    r_asia: "Asia", r_africa: "Africa", r_europe: "Europe", r_mideast: "Middle East", r_america: "Americas", r_oceania: "Oceania",
    noPhoto: "No photo yet", photo: "Photo", emblem: "Emblem © Türkiye Maarif Vakfı", office: "Foundation office (not a school)", mapHint: "Tap a school in the list to see it on the map", title: "Maarif schools", sub: "Türkiye Maarif Vakfı institutions and the air around them", layer: "🏫 Maarif schools", moreSub: "Map, addresses and air near schools",
    k12: "Kindergarten + school (K-12)", primary: "Primary school", lyceum: "Lyceum (high school)", univ: "University", hq: "Foundation headquarters (not a school)",
    exact: "exact address", street: "address ≈ street", city: "≈ approximate, city", noAddr: "address not published", since: "open since {d}", first: "TMV's first school in Kyrgyzstan",
    grades: "grades {g}", langs4: "taught in Kyrgyz, Russian, English and Turkish", boys: "boys' lyceum", girls: "girls' lyceum", cambridge: "Cambridge programmes (IGCSE, A Levels)",
    students: "≈{n} students", route: "📍 Directions", site: "Website", src: "Source", aqiNear: "Air near the school", search: "Search: name or city", all: "All",
    count: "{n} institutions", kg: "🇰🇬 Kyrgyzstan", tr: "🇹🇷 Türkiye", allList: "All schools →",
    trNote: "TMV runs schools abroad: under Law No. 6721 it does not run education inside Türkiye (except training teachers). In Türkiye there are only its offices: the Istanbul headquarters and an Ankara office.",
    note: "Public sources: the official TMV list, sapat.edu.kg and kg.maarifschools.org (as of {d}). SAPAT lyceums in Kyrgyzstan were transferred to the foundation in 2024. “≈” pins are placed by city or street — confirm the address by phone.", nothing: "Nothing found" },
  tr: { titleW: "Dünyada Maarif okulları", subW: "Türkiye Maarif Vakfı eğitim kurumları dünya haritasında", offH: "TMV resmî verileri ({d} itibarıyla)", o_countries: "ülke", o_inst: "eğitim kurumu", o_schools: "okul", o_students: "öğrenci", o_univ2: "üniversite", o_trc: "Türkiye Araştırmaları Merkezi", o_edc: "eğitim merkezi", o_dorm: "yurt",
    offNote: "haritada Vakfın açık listesinden {c} ülkede {n} kurum var; TMV diğerlerinin adreslerini yayımlamıyor", searchW: "Ara: okul, şehir veya ülke", country: "Ülke", allCtr: "Tüm ülkeler", stat: "Ülkeler: <b>{c}</b> · Kurumlar: <b>{n}</b>",
    mapHintW: "Daire içindeki sayı yakın birkaç kurumu gösterir — yakınlaştırmak için dokunun", approx: "≈ yaklaşık (şehir)", clLeg: "kurum grubu", clTip: "{n} kurum — yakınlaştır",
    noteW: "Kurumlar TMV'nin resmî «Kurum Listesi»nden alındı ({d} itibarıyla); aynı kampüsün tekrarları çıkarıldı. Kırgızistan: sapat.edu.kg ve kg.maarifschools.org. Koordinatlar: OpenStreetMap; «≈» noktanın şehir veya cadde düzeyinde olduğunu gösterir. Fotoğraflar yalnızca bu okulların resmî sitelerinden; gerçek fotoğraf yoksa amblem gösterilir.",
    ctryOnly: "Bu ülkede Vakıf yalnızca ofis veya merkez yayımlıyor — okul listesi netleştiriliyor.", school: "Okul", kinder: "Anaokulu", center: "Eğitim merkezi",
    r_asia: "Asya", r_africa: "Afrika", r_europe: "Avrupa", r_mideast: "Orta Doğu", r_america: "Amerika", r_oceania: "Okyanusya",
    noPhoto: "Henüz fotoğraf yok", photo: "Fotoğraf", emblem: "Amblem © Türkiye Maarif Vakfı", office: "Vakıf ofisi (okul değil)", mapHint: "Listeden bir okula dokunun, harita onu göstersin", title: "Maarif okulları", sub: "Türkiye Maarif Vakfı eğitim kurumları ve çevrelerindeki hava", layer: "🏫 Maarif okulları", moreSub: "Harita, adresler ve okul çevresindeki hava",
    k12: "Anaokulu + okul (K-12)", primary: "İlkokul", lyceum: "Lise", univ: "Üniversite", hq: "Vakıf genel merkezi (okul değil)",
    exact: "tam adres", street: "adres ≈ cadde", city: "≈ yaklaşık, şehir", noAddr: "adres yayımlanmamış", since: "{d} tarihinden beri", first: "TMV'nin Kırgızistan'daki ilk okulu",
    grades: "{g}. sınıflar", langs4: "Kırgızca, Rusça, İngilizce ve Türkçe eğitim", boys: "erkek lisesi", girls: "kız lisesi", cambridge: "Cambridge programları (IGCSE, A Levels)",
    students: "≈{n} öğrenci", route: "📍 Yol tarifi", site: "Web sitesi", src: "Kaynak", aqiNear: "Okul çevresinde hava", search: "Ara: ad veya şehir", all: "Tümü",
    count: "{n} kurum", kg: "🇰🇬 Kırgızistan", tr: "🇹🇷 Türkiye", allList: "Tüm okullar →",
    trNote: "TMV okullarını yurt dışında açar: 6721 sayılı kanuna göre yurt içinde (eğitici yetiştirme dışında) eğitim faaliyeti yürütmez. Türkiye'de yalnızca Vakıf ofisleri var: İstanbul genel merkezi ve Ankara ofisi.",
    note: "Açık kaynaklar: TMV resmi listesi, sapat.edu.kg ve kg.maarifschools.org ({d} itibarıyla). Kırgızistan'daki SAPAT liseleri 2024'te Vakfa devredildi. “≈” işaretli noktalar şehir veya cadde düzeyindedir — adresi telefonla teyit edin.", nothing: "Sonuç yok" },
};
const mfPl = (n, f) => { const a = n % 10, b = n % 100; return f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2]; };
const MF_CNT = { ru: n => n + " " + mfPl(n, ["учреждение", "учреждения", "учреждений"]), en: n => n + (n === 1 ? " institution" : " institutions") };
const MT = (k, v = {}) => k === "count" && MF_CNT[LANG] ? MF_CNT[LANG](+v.n) : String((MF_T[LANG] || MF_T.ru)[k] ?? MF_T.ru[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? "");
const mfCity = s => tr(MF_CITY[s.city]) || s.city;

/* Живой AQI у каждой школы — Open-Meteo, один пакетный запрос по координатам школ */
const mfAir = { status: "idle", by: {}, at: 0 };
async function loadMfAir() {
  if (mfAir.status === "loading" || (mfAir.status === "ok" && Date.now() - mfAir.at < 10 * 60e3) || (mfAir.status === "err" && Date.now() - mfAir.at < 2 * 60e3)) return;
  mfAir.status = "loading";
  try {
    const res = await fetchJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${MAARIF.map(s => s.lat).join(",")}&longitude=${MAARIF.map(s => s.lon).join(",")}&current=us_aqi,pm2_5&timezone=auto`, 12000);
    const arr = Array.isArray(res) ? res : [res];
    MAARIF.forEach((s, i) => { const c = arr[i] && arr[i].current; if (c && c.us_aqi != null) mfAir.by[s.id] = { aqi: Math.round(c.us_aqi), pm25: c.pm2_5 }; });
    mfAir.status = "ok"; mfAir.at = Date.now();
  } catch (e) { console.warn("Open-Meteo (школы) недоступен:", e.message); mfAir.status = "err"; mfAir.at = Date.now(); }
  const h = (location.hash || "").slice(1).split("/")[0];
  if (h === "schools" && map && $("#mfList")) { mfRefreshIcons(); $("#mfList").innerHTML = mfListHTML(); mfBindList($("#view")); }
  else if (h === "map" && map && mfLayer) mfRefreshIcons();
}
function mfAqiChip(s) {
  const a = mfAir.by[s.id]; if (!a) return mfAir.status === "loading" || mfAir.status === "idle" ? `<span class="mf-aqi muted">…</span>` : "";
  const Lv = level(a.aqi);
  return `<span class="mf-aqi" style="background:${Lv.color}" title="US AQI">${a.aqi}</span>`;
}
function mfFacts(s) {
  const f = [];
  if (s.first) f.push(MT("first"));
  if (s.since) f.push(MT("since", { d: s.since }));
  if (s.grades) f.push(MT("grades", { g: s.grades }));
  if (s.g) f.push(MT(s.g));
  if (s.langs4) f.push(MT("langs4"));
  if (s.cambridge) f.push(MT("cambridge"));
  if (s.students) f.push(MT("students", { n: fmt(s.students) }));
  return f;
}
const mfDir = s => `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`;
function mfCard(s, popup) {
  const a = mfAir.by[s.id], Lv = a && level(a.aqi), facts = mfFacts(s);
  const ph = mfPh(s);
  const photo = ph ? `<figure class="mf-ph"><img src="images/schools/${s.id}.jpg" alt="${esc(s.name)}" loading="lazy"><figcaption>${MT("photo")}: <a href="${ph.src}" target="_blank" rel="noopener">${esc(ph.by || ph.src.replace(/^https?:\/\//, "").split("/")[0])}</a></figcaption></figure>`
    : `<div class="mf-ph none"><img src="${MF_EMB}" alt=""><span>${MT("noPhoto")}</span></div>`;
  return `<div class="mf-card${popup ? " pop" : ""}">${photo}
    <div class="mf-h"><img class="mf-ico" src="${MF_EMB}" alt="Maarif"><div style="flex:1"><b class="mf-name">${esc(s.name)}</b>
      <div class="small mf-lvl">${MT(s.lvl)} · ${esc(mfCity(s))}${typeof mfCtryName === "function" ? ` · ${mfFlag(s.c)} ${esc(mfCtryName(s.c))}` : ""}</div></div>${popup ? "" : mfAqiChip(s)}</div>
    <div class="small mf-addr">📍 ${s.addr ? esc(s.addr) : `<i>${MT("noAddr")}</i>`} <span class="mf-prec ${s.prec}">${MT(s.prec)}</span></div>
    ${facts.length ? `<div class="small mf-facts">${facts.map(esc).join(" · ")}</div>` : ""}
    ${a ? `<div class="small mf-air"><span class="dot" style="background:${Lv.color}"></span>${MT("aqiNear")}: <b style="color:${Lv.color}">AQI ${a.aqi}</b> — ${tr(Lv.name)}${a.pm25 != null ? ` · PM2.5 ${fmt(a.pm25, 1)}` : ""}</div>` : ""}
    <div class="mf-links small"><a href="${mfDir(s)}" target="_blank" rel="noopener">${MT("route")}</a>${s.tel ? `<a href="tel:${s.tel.replace(/\s/g, "")}">☎ ${esc(s.tel)}</a>` : ""}${s.web ? `<a href="${s.web}" target="_blank" rel="noopener">${MT("site")}</a>` : ""}<a href="${s.src}" target="_blank" rel="noopener">${MT("src")}</a></div>
  </div>`;
}

/* ---------- Слой на картах (город и страна) ---------- */
let mfBig = false;
const mfPopOpts = () => ({ maxWidth: Math.min(270, innerWidth - 70), minWidth: Math.min(230, innerWidth - 90), autoPan: true, autoPanPaddingTopLeft: [12, 70], autoPanPaddingBottomRight: [12, innerWidth < 900 ? 96 : 24] });
let mfOn = localStorage.getItem("tazaAba.mf") === "1"   /* слой школ на карте воздуха по умолчанию выключен */, mfLayer = null;
const mfIcon = s => { const a = mfAir.by[s.id], sm = mapMode === "country" && !mfBig && !document.getElementById("mfMap"), z = sm ? 28 : 38; return L.divIcon({ className: "", html: `<div class="mf-pin${sm ? " sm" : ""}${s.lvl === "hq" || s.lvl === "office" ? " hq" : ""}${s.prec === "exact" ? "" : " approx"}"${a ? ` style="--aq:${level(a.aqi).color}"` : ""}><b class="mf-emb"></b>${s.prec === "exact" ? "" : "<i>≈</i>"}</div>`, iconSize: [z, z], iconAnchor: [z / 2, z / 2], popupAnchor: [0, -z / 2 + 2] }); };
function mfAttach(el) {
  if (!map) return;
  const ctry = cityObj().country || "kg";
  mfLayer = L.layerGroup(); let built = false;
  const build = () => { if (built) return; built = true; const po = mfPopOpts();   /* маркеры строятся лениво — только когда слой включён */
    MAARIF.filter(s => s.c === ctry).forEach(s => {
      const m = L.marker([s.lat, s.lon], { icon: mfIcon(s), zIndexOffset: 500 }); m._mf = s;
      m.bindPopup(() => mfCard(s, true) + `<div class="small" style="margin-top:6px"><a href="#schools">${MT("allList")}</a></div>`, po); m.addTo(mfLayer);
    }); };
  mfLayer.on("add", build);
  if (mfOn) mfLayer.addTo(map);
  const tg = el.querySelector(".toggles");
  if (tg) {
    tg.insertAdjacentHTML("beforeend", `<div class="toggle mf-toggle ${mfOn ? "on" : ""}" id="mfToggle" role="button" tabindex="0">${MT("layer")}</div>`);
    const b = el.querySelector("#mfToggle");
    b.onclick = () => { mfOn = !mfOn; localStorage.setItem("tazaAba.mf", mfOn ? "1" : "0"); b.classList.toggle("on", mfOn); mfOn ? mfLayer.addTo(map) : map.removeLayer(mfLayer); };
  }
  loadMfAir();
}
const _mfViewMap = views.map;
views.map = el => {
  if (location.hash === "#map/country") { mapMode = "country"; history.replaceState(null, "", "#map"); }   // прямая ссылка на карту страны
  _mfViewMap(el); try { mfAttach(el); } catch (e) { console.warn("maarif layer:", e); } };

/* ---------- Раздел «Школы Маариф» (#schools) — карта мира ---------- */
/* MF_W и MF_CTRY — maarif-world.js (официальный список TMV «Dünyada Maarif», геокодирование Nominatim/OSM) */
const MF_ALL = () => MAARIF.concat(typeof MF_W !== "undefined" ? MF_W : []);
const MF_CTRY0 = { kg: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan", tr: "Kırgızistan", reg: "asia" }, tr: { ru: "Турция", ky: "Түркия", en: "Türkiye", tr: "Türkiye", reg: "mideast" } };
const mfCtry = c => (typeof MF_CTRY !== "undefined" && MF_CTRY[c]) || MF_CTRY0[c] || { ru: c, ky: c, en: c, tr: c, reg: "asia" };
const mfCtryName = c => tr(mfCtry(c));
const MF_REG = ["asia", "africa", "europe", "mideast", "america", "oceania"];
let mfQ = "", mfC = "all", mfCo = "", mfMarkers = {}, mfOpenC = null;
const mfMatch = s => { const q = mfQ.trim().toLowerCase();
  const okF = mfC === "all" || (mfC === "kg" ? s.c === "kg" : mfCtry(s.c).reg === mfC);
  const okC = !mfCo || s.c === mfCo;
  return okF && okC && (!q || (s.name + " " + (MF_CITY[s.city] ? Object.values(MF_CITY[s.city]).join(" ") : s.city) + " " + (s.addr || "") + " " + Object.values(mfCtry(s.c)).join(" ")).toLowerCase().includes(q)); };
const mfPh = s => (typeof MF_PHOTO_W !== "undefined" && MF_PHOTO_W[s.id]) || (MF_PHOTO[s.id] ? { src: MF_PHOTO[s.id], by: MF_PHOTO_BY[s.id] } : null);
function mfThumb(s) { return mfPh(s) ? `<img class="mf-th" src="images/schools/${s.id}.jpg" alt="" loading="lazy">` : `<div class="mf-th none"><img src="${MF_EMB}" alt=""></div>`; }
function mfRow(s) { return `<div class="card mf-row" data-mf="${s.id}" role="button" tabindex="0">${mfThumb(s)}
  <div style="flex:1;min-width:0"><b class="mf-name">${esc(s.name)}</b><div class="small mf-lvl">${MT(s.lvl)} · ${esc(mfCity(s))}</div>
  <div class="small mf-addr">${s.addr ? esc(s.addr) : `<i>${MT("noAddr")}</i>`} <span class="mf-prec ${s.prec}">${MT(s.prec)}</span></div></div>${s.c === "kg" || s.c === "tr" ? mfAqiChip(s) : ""}</div>`; }
function mfListHTML() {
  const items = MF_ALL().filter(mfMatch);
  if (!items.length) return `<div class="card muted">${MT("nothing")}</div>`;
  const cs = [...new Set(items.map(s => s.c))].sort((a, b) => a === "kg" ? -1 : b === "kg" ? 1 : mfCtryName(a).localeCompare(mfCtryName(b), LANG));
  const many = cs.length > 1;
  return cs.map(c => { const ss = items.filter(s => s.c === c), open = !many || mfOpenC === c || c === "kg" && mfC === "kg";
    let h = `<details class="mf-cgrp" data-c="${c}"${open ? " open" : ""}><summary class="mf-ctry"><span>${mfFlag(c)} ${esc(mfCtryName(c))}</span> <span class="chip">${MT("count", { n: ss.length })}</span></summary>`;
    if (c === "tr") h += `<div class="card mf-note small">ℹ️ ${MT("trNote")}</div>`;
    if (ss.every(s => s.lvl === "office" || s.lvl === "center" || s.lvl === "hq")) h += `<div class="small muted mf-cnote">${MT("ctryOnly")}</div>`;
    if (c === "kg") [...new Set(ss.map(s => s.city))].forEach(ci => { const x = ss.filter(s => s.city === ci); h += `<h3 class="mf-city">${esc(tr(MF_CITY[ci]))} · ${x.length}</h3>${x.map(mfRow).join("")}`; });
    else h += ss.map(mfRow).join("");
    return h + `</details>`; }).join("");
}
const mfFlag = c => c === "cy-n" ? "🇨🇾" : c.length === 2 ? String.fromCodePoint(...[...c.toUpperCase()].map(x => 0x1F1E6 + x.charCodeAt(0) - 65)) : "🏳️";
/* лёгкая кластеризация: сетка 56 px в экранных координатах, пересчёт на zoomend/moveend */
let mfItems = [], mfClLayer = null;
function mfCluster() {
  if (!map || !document.getElementById("mfMap")) return;
  if (!mfClLayer) mfClLayer = L.layerGroup().addTo(map);
  mfClLayer.clearLayers(); mfMarkers = {};
  const z = map.getZoom(), R = innerWidth < 600 ? 46 : 52, cl = [];   /* жадная кластеризация по расстоянию в пикселях */
  mfItems.forEach(s => { const p = map.project([s.lat, s.lon], z); let best = null, bd = R;
    if (z < 15) cl.forEach(c => { const d = Math.hypot(c.x - p.x, c.y - p.y); if (d < bd) { bd = d; best = c; } });
    if (best) { best.g.push(s); best.x = (best.x * (best.g.length - 1) + p.x) / best.g.length; best.y = (best.y * (best.g.length - 1) + p.y) / best.g.length; } else cl.push({ x: p.x, y: p.y, g: [s] }); });
  const grid = cl.map(c => c.g);
  grid.forEach(g => {
    if (g.length === 1) { const s = g[0], m = L.marker([s.lat, s.lon], { icon: mfIcon(s), zIndexOffset: 500 }); m._mf = s; mfMarkers[s.id] = m;
      m.bindPopup(() => mfCard(s, true), mfPopOpts()); m.addTo(mfClLayer); return; }
    const lat = g.reduce((a, s) => a + s.lat, 0) / g.length, lon = g.reduce((a, s) => a + s.lon, 0) / g.length, n = g.length, d = n < 10 ? 34 : n < 50 ? 40 : 46;
    const m = L.marker([lat, lon], { icon: L.divIcon({ className: "", html: `<div class="mf-cl" style="width:${d}px;height:${d}px"><b class="mf-emb"></b><span>${n}</span></div>`, iconSize: [d, d], iconAnchor: [d / 2, d / 2] }), zIndexOffset: 600, title: MT("clTip", { n }) });
    m.on("click", () => { const b = L.latLngBounds(g.map(s => [s.lat, s.lon])); if (b.getNorthEast().equals(b.getSouthWest()) || map.getZoom() >= 15) { map.setView(b.getCenter(), 16); } else map.fitBounds(b.pad(0.3), { maxZoom: 16 }); });
    g.forEach(s => { mfMarkers[s.id] = m; }); m._cl = g; m.addTo(mfClLayer);
  });
}
function mfRefreshIcons() { if (document.getElementById("mfMap")) { mfCluster(); return; } if (!mfLayer) return; mfLayer.eachLayer(m => { if (m._mf) { m.setIcon(mfIcon(m._mf)); if (m.isPopupOpen && m.isPopupOpen()) m.setPopupContent(mfCard(m._mf, true)); } }); }
function mfFocus(id) {
  const s = MF_ALL().find(x => x.id === id); if (!s || !map) return;
  if (innerWidth < 900) $("#mfMap").scrollIntoView({ block: "start", behavior: "smooth" });
  map.flyTo([s.lat, s.lon], 16, { duration: 0.8 });
  map.once("moveend", () => { mfCluster(); const m = mfMarkers[id]; if (m && m._mf) m.openPopup(); else L.popup(mfPopOpts()).setLatLng([s.lat, s.lon]).setContent(mfCard(s, true)).openOn(map); });
}
function mfBindList(el) {
  el.querySelectorAll("[data-mf]").forEach(r => { r.onclick = () => mfFocus(r.dataset.mf); r.onkeydown = e => { if (e.key === "Enter") mfFocus(r.dataset.mf); }; });
  el.querySelectorAll("details.mf-cgrp").forEach(d => d.addEventListener("toggle", () => { if (d.open) mfOpenC = d.dataset.c; }));
}
function mfFillMap(fit = true) {
  if (!map) return;
  mfItems = MF_ALL().filter(mfMatch);
  mfCluster();
  if (fit) { if (mfC === "all" && !mfCo && !mfQ.trim()) map.setView([22, 25], innerWidth < 600 ? 1.25 : 2);
    else if (mfItems.length) map.fitBounds(L.latLngBounds(mfItems.map(s => [s.lat, s.lon])).pad(0.15), { maxZoom: 12 }); }
  const st = $("#mfStat"); if (st) st.innerHTML = MT("stat", { c: new Set(mfItems.map(s => s.c)).size, n: mfItems.length });
}
function viewSchools(el) {
  const all = MF_ALL(), ctrs = [...new Set(all.map(s => s.c))].sort((a, b) => mfCtryName(a).localeCompare(mfCtryName(b), LANG));
  const nIn = f => all.filter(f).length, nCtr = new Set(all.map(s => s.c)).size;
  const F = [["all", MT("all") + ` · ${all.length}`], ["kg", MT("kg") + ` · ${nIn(s => s.c === "kg")}`]].concat(MF_REG.map(r => [r, MT("r_" + r) + ` · ${nIn(s => mfCtry(s.c).reg === r)}`]));
  const O = MF_OFFICIAL;
  mfBig = true;
  el.innerHTML = `<div class="mf-head"><img src="icons/maarif-logo.png" alt="Türkiye Maarif Vakfı" class="mf-logo"><div><h1>${MT("titleW")}</h1><p class="sub">${MT("subW")}</p></div></div>
    <div class="card mf-off"><div class="mf-off-h small">${MT("offH", { d: O.date })}</div>
      <div class="mf-off-g">${[["countries", O.countries], ["inst", O.inst], ["schools", O.schools], ["students", O.students], ["univ2", O.univ], ["trc", O.trc], ["edc", O.edc], ["dorm", O.dorm]].map(([k, v]) => `<div><b>${esc(String(v))}</b><span>${MT("o_" + k)}</span></div>`).join("")}</div>
      <div class="small muted">${MT("src")}: <a href="${MF_SRC_LIST}" target="_blank" rel="noopener">turkiyemaarif.org/dunyada-maarif</a> · ${MT("offNote", { c: nCtr, n: all.length })}</div></div>
    <div class="mf-tools"><div class="mf-row2"><input id="mfSearch" type="search" aria-label="${esc(MT("searchW"))}" placeholder="${MT("searchW")}" value="${esc(mfQ)}" autocomplete="off">
      <select id="mfCo" aria-label="${MT("country")}"><option value="">🌍 ${MT("allCtr")} (${ctrs.length})</option>${ctrs.map(c => `<option value="${c}"${mfCo === c ? " selected" : ""}>${mfFlag(c)} ${esc(mfCtryName(c))} · ${nIn(s => s.c === c)}</option>`).join("")}</select></div>
      <div class="filters">${F.map(([k, l]) => `<div class="toggle ${mfC === k ? "on" : ""}" data-mfc="${k}" role="button" tabindex="0">${l}</div>`).join("")}</div>
      <div class="mf-stat" id="mfStat"></div></div>
    <div class="mf-layout"><div class="mf-mapcol"><div id="mfMap"></div><div class="small muted mf-hint">${MT("mapHintW")} · ${MT("emblem")}</div>
      <div class="mf-legend small"><span><i class="mf-pin lg"></i>${MT("exact")}</span><span><i class="mf-pin lg approx"></i>${MT("approx")}</span><span><i class="mf-cl lg"></i>${MT("clLeg")}</span></div></div>
    <div class="mf-listcol" id="mfList">${mfListHTML()}</div></div>
    <div class="card mf-note small">📚 ${MT("noteW", { d: MF_DATE })} <a href="${MF_SRC_LIST}" target="_blank" rel="noopener">turkiyemaarif.org</a> · <a href="https://sapat.edu.kg/contact" target="_blank" rel="noopener">sapat.edu.kg</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a><br>${MT("emblem")}</div>
    <div class="foot">${t("footProto")}</div>`;
  map = mkMap("mfMap", { zoomControl: true, zoomSnap: 0.25, worldCopyJump: true, minZoom: 1 });
  mfClLayer = null;
  baseTiles(map); mfFillMap(); mfBig = false;
  map.on("zoomend", mfCluster);
  setTimeout(() => { if (map) { map.invalidateSize(); mfFillMap(); } }, 80);
  const relist = () => { $("#mfList", el).innerHTML = mfListHTML(); mfBindList(el); };
  const inp = $("#mfSearch", el);
  inp.oninput = () => { mfQ = inp.value; relist(); mfBig = true; mfFillMap(); mfBig = false; };
  $("#mfCo", el).onchange = e => { mfCo = e.target.value; mfOpenC = mfCo || null; relist(); mfFillMap(); };
  el.querySelectorAll("[data-mfc]").forEach(b => { const go = () => { mfC = b.dataset.mfc; mfCo = ""; mfOpenC = null; route(true); }; b.onclick = go; b.onkeydown = e => { if (e.key === "Enter") go(); }; });
  mfBindList(el);
  loadMfAir();
}
lazyView("schools", ["maarif-world.js"], () => typeof MF_W !== "undefined", viewSchools); TAB_OF.schools = "more"; TAB_OF.history = "more";   /* мировой список грузится только при открытии #schools */
/* «История и статистика» — ленивый модуль (history.js + history.css грузятся только при открытии #history) */
lazyView("history", ["history.css", "history.js"], () => typeof window.viewHistory === "function", el => window.viewHistory(el));
/* пункт «Школы Маариф» теперь в сетке «Ещё» (quick.js → viewMore2) */
/* app.js уже отрисовал стартовый экран — перерисовать, если открыт раздел, который мы расширили */
if (/^#(schools|history|map|more)/.test(location.hash || "")) route(true);
