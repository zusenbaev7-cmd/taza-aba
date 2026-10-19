# Backend (Supabase) для аккаунтов «Таза Аба»
- `schema.sql` — таблица `profiles` (только шифротекст), RLS «только своя строка», приватный бакет `avatars` с политиками по папке `<user_id>/`, функция `delete_my_account()`.
- `setup.sh` — создаёт проект через Supabase Management API (`SUPABASE_ACCESS_TOKEN`), применяет схему, пишет `SUPABASE_URL` и `SUPABASE_ANON_KEY` в `config.js`.
- Пока ключи пустые, приложение работает в локальном режиме (зашифрованные аккаунты только на устройстве).
