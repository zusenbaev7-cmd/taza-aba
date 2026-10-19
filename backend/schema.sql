-- Таза Аба — серверные аккаунты (Supabase). Сервер хранит ТОЛЬКО шифротекст профиля и аватара.
-- Ключ шифрования выводится на клиенте: PBKDF2-SHA256(пароль, enc_salt, kdf_iter) → AES-GCM 256.
-- В Supabase Auth уходит не пароль, а authPw = PBKDF2(пароль, "tazaaba-auth:"+email) (hex), так что сервер не может получить ключ.

create table if not exists public.taza_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  enc_salt   text not null,              -- base64, 16 байт, случайная соль для ключа шифрования
  kdf_iter   integer not null default 310000 check (kdf_iter >= 310000),
  iv         text not null,              -- base64, 12 байт
  ct         text not null,              -- base64, AES-GCM шифротекст JSON профиля
  updated_at timestamptz not null default now()
);
alter table public.taza_profiles enable row level security;
alter table public.taza_profiles force row level security;

drop policy if exists "taza own row select" on public.taza_profiles;
drop policy if exists "taza own row insert" on public.taza_profiles;
drop policy if exists "taza own row update" on public.taza_profiles;
drop policy if exists "taza own row delete" on public.taza_profiles;
create policy "taza own row select" on public.taza_profiles for select to authenticated using (user_id = auth.uid());
create policy "taza own row insert" on public.taza_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "taza own row update" on public.taza_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "taza own row delete" on public.taza_profiles for delete to authenticated using (user_id = auth.uid());
revoke all on public.taza_profiles from anon;
grant select, insert, update, delete on public.taza_profiles to authenticated;

-- Все объекты с префиксом taza_ / taza-aba-, чтобы не задевать другие данные проекта.
-- Приватный бакет для зашифрованных аватаров: путь <user_id>/avatar.bin, не больше 512 КБ.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('taza-aba-avatars', 'taza-aba-avatars', false, 524288, array['application/octet-stream'])
on conflict (id) do update set public = false, file_size_limit = 524288, allowed_mime_types = array['application/octet-stream'];

drop policy if exists "taza avatars own read" on storage.objects;
drop policy if exists "taza avatars own insert" on storage.objects;
drop policy if exists "taza avatars own update" on storage.objects;
drop policy if exists "taza avatars own delete" on storage.objects;
create policy "taza avatars own read" on storage.objects for select to authenticated
  using (bucket_id = 'taza-aba-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "taza avatars own insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'taza-aba-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "taza avatars own update" on storage.objects for update to authenticated
  using (bucket_id = 'taza-aba-avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'taza-aba-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "taza avatars own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'taza-aba-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Удаление своего аккаунта (вызывается клиентом: rpc('taza_delete_my_account')).
create or replace function public.taza_delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from storage.objects where bucket_id = 'taza-aba-avatars' and (storage.foldername(name))[1] = auth.uid()::text;
  delete from auth.users where id = auth.uid();   -- taza_profiles удалится каскадом
end $$;
revoke all on function public.taza_delete_my_account() from public, anon;
grant execute on function public.taza_delete_my_account() to authenticated;
