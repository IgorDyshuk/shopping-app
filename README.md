# Test Shopping App

React + TypeScript + Vite магазин с базовым каркасом, i18n, общим хедером и API-слоем на axios/TanStack Query.

## Технологии
- React 19, TypeScript, Vite
- Tailwind (utility-классы), shadcn/ui за кнопки/комбобокс
- i18next + react-i18next (EN/UK, namespaces по страницам)
- Axios + TanStack React Query для запросов и кэша

## Структура
- `src/i18n.ts` — инициализация i18n, namespaces `common`, `home`.
- `src/locales/{en,uk}/` — переводы, разнесены по файлам `common.json`, `home.json`.
- `src/lib/apiConfig.ts` — базовый URL и таймауты (по умолчанию fakestoreapi).
- `src/api/client.ts` — axios-инстанс с auth-header и базовой конфигурацией.
- `src/api/{products,auth}.ts` — сервисы для fakestore API.
- `src/hooks/{useProducts,useAuth}.ts` — хуки на TanStack Query.
- `src/lib/queryClient.ts` — QueryClient с дефолтами; подключён в `src/main.tsx`.
- `src/components/layout/Header.tsx` + `Header/LanguageSwitcher.tsx` — хедер и переключатель языка.
- `src/pages/Home.tsx` — главная страница, тянет тексты из `home` и `common` и выводит продукты из API.
- `src/App.tsx` — оборачивает лейаутом и рендерит страницы.

## Запуск
- Установка: `npm install` (или `npm ci`).
- Дев-сервер: `npm run dev` и открыть URL, который покажет Vite.
- Билд: `npm run build` (при необходимости перенастройте `tsBuildInfoFile` для записи в доступную папку).

## Переключение API
- Задайте `VITE_API_URL` в `.env` для другого бэкенда; по умолчанию используется `https://fakestoreapi.com`.
- Таймаут можно настроить через `VITE_API_TIMEOUT` (в мс).
