# Marketplace вещей блогеров

React + TypeScript + Vite проект: i18n, API-слой на axios/TanStack Query, общий хедер, поиск и навигация под маркетплейс перепродажи вещей инфлюенсеров.

## Технологии
- React 19, TypeScript, Vite
- Tailwind (utility-классы), shadcn/ui (InputGroup, Navigation Menu, кнопки)
- i18next + react-i18next (EN/UK, namespaces per page)
- Axios + TanStack React Query (fakestore API)

## Структура
- `src/i18n.ts` — инициализация i18n, namespaces `common`, `home`.
- `src/locales/{en,uk}/` — переводы (`common.json`, `home.json`).
- `src/lib/apiConfig.ts` — базовый URL/таймауты (`VITE_API_URL`, `VITE_API_TIMEOUT`).
- `src/api/client.ts` — axios-инстанс с auth-header.
- `src/api/{products,auth}.ts` — сервисы fakestore.
- `src/hooks/{useProducts,useAuth}.ts` — хуки React Query.
- `src/lib/queryClient.ts` — QueryClient; подключён в `src/main.tsx`.
- `src/components/layout/Header.tsx` — хедер с LanguageSwitcher, NavigationMenu и поиском.
- `src/components/layout/Header/Navigation.tsx` — навигация под маркетплейс (дропы, каталог, создатели, продать вещь, FAQ) на Radix Navigation Menu.
- `src/components/layout/Header/SearchBar.tsx` — InputGroup с подсказками (фильтр по товарам, открытия по вводу, закрытие по Esc/клику вне, анимация появления/исчезновения).
- `src/components/ui/navigation-menu.tsx` — UI-компоненты навигационного меню.
- `src/pages/Home.tsx` — главная, тянет тексты из `home`/`common`, выводит товары.
- `src/App.tsx` — обёртка лейаута и страниц.

## Запуск
- Установка: `npm install` (или `npm ci`).
- Дев-сервер: `npm run dev` и открыть URL Vite.
- Билд: `npm run build` (при необходимости перенастроить `tsBuildInfoFile`).

## Переключение API
- `VITE_API_URL` — другой бэкенд (по умолчанию `https://fakestoreapi.com`).
- `VITE_API_TIMEOUT` — таймаут запросов в мс.
