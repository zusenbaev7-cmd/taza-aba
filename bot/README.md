# Telegram-алерты о смоге (Таза Аба)

Бот рассылает подписчикам предупреждение, когда AQI (модель CAMS через Open-Meteo) в выбранном районе превышает порог.

## Что нужно от владельца (один раз)

1. Создать бота у [@BotFather](https://t.me/BotFather) → получить **токен**.
2. Задать username бота (например `taza_aba_bot`) — он же пойдёт в ссылку `t.me/<bot>?start=<districtId>`.
3. В репозитории GitHub → Settings → Secrets:
   - `TELEGRAM_BOT_TOKEN` — токен от BotFather
4. В `config.js` приложения:
   - `TELEGRAM_BOT: "taza_aba_bot"` — **без** `@` (пусто = кнопка подписки скрыта)
5. Включить workflow: Actions → «Smog alerts» (уже лежит в `.github/workflows/smog-alerts.yml`). По умолчанию cron раз в час; без секрета workflow сразу выходит без ошибок.

## Как устроено

- Подписчики хранятся в `bot/subscribers.json` в репозитории (chat_id → districtId, city, lang, threshold). Файл обновляет сам бот через GitHub API при `/start` и `/stop` (нужен `GITHUB_TOKEN` у Actions — есть по умолчанию; для записи в репозиторий workflow должен иметь `contents: write`).
- Рассылка: GitHub Actions cron читает Open-Meteo Air Quality по координатам района из `kg-places.js` / `data.js`, сравнивает с порогом (по умолчанию AQI ≥ 100), шлёт сообщение через Bot API.
- Пока `TELEGRAM_BOT` в config пуст и секрета нет — UI показывает «скоро» / инструкцию, бот и workflow ничего не шлют.

## Локальный прогон

```bash
export TELEGRAM_BOT_TOKEN=...   # опционально
export DRY_RUN=1                # только печать, без sendMessage
node bot/send_alerts.js
```
