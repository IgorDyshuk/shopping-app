# Marketplace вещей блогеров

React + TypeScript + Vite проект: i18n, API-слой на axios/TanStack Query, общий хедер, поиск и навигация под маркетплейс перепродажи вещей инфлюенсеров.

## Технологии
- React 19, TypeScript, Vite
- Tailwind, shadcn/ui (Navigation Menu, кнопки, Tooltip и др.)
- i18next + react-i18next (EN/UK, per-page namespaces, язык хранится в zustand)
- Axios + TanStack React Query (fakestore API + Spotify API)
- Zustand + persist (recently viewed товары, выбранный язык)

## Структура
- `src/i18n.ts` — инициализация i18n, namespaces `common`, `home`, `catalog`, `category`, `product`, `blogger`; стартовый язык берётся из zustand.
- `src/locales/{en,uk}/` — переводы (`common.json`, `home.json`, `catalog.json`, `category.json`, `product.json`, `blogger.json`).
- `src/stores/use-language.ts` — zustand-persist для выбранного языка (используется в i18n и `LanguageSwitcher`).
- `src/stores/use-viewed-products.ts` — недавно просмотренные товары (persist в localStorage).
- `src/lib/apiConfig.ts` — базовый URL/таймауты (`VITE_API_URL`, `VITE_API_TIMEOUT`).
- `src/api/client.ts` — axios-инстанс с auth-header.
- `src/api/{products,auth}.ts` — сервисы fakestore.
- `src/api/spotify.ts` — client-credentials Spotify (`VITE_SPOTIFY_CLIENT_ID`, `VITE_SPOTIFY_CLIENT_SECRET`, опционально `VITE_SPOTIFY_ACCESS_TOKEN`), кэш токена в рантайме.
- `src/hooks/api-hooks/{useProducts,useAuth,useArtists,useSellers}.ts` — хуки React Query.
- `src/types/{product,artist}.ts` — типы товара и артиста Spotify.
- `src/lib/queryClient.ts` — QueryClient; подключён в `src/main.tsx`.
- `src/constants/{filters-presets,blogger-ids}.ts` — пресеты фильтров и список ID блогеров.
- `src/components/layout/Header.tsx` — фиксированный хедер с адаптивным поиском и навигацией; `LanguageSwitcher` читает язык из zustand.
- `src/components/layout/Header/SideBar/*` — сайдбар (моб/десктоп) с навигацией и сменой языка.
- `src/components/layout/skeletons/{HomeSkeleton,ProductSkeleton,BloggerSkeleton}.tsx` — скелетоны главной, товара, блогера.
- `src/components/products/{ProductCard,ProductCarousel}.tsx` — карточки и карусель товаров (Embla, autoplay, responsive perRow, peek next).
- `src/components/pages/ProductPage/*` — галерея, рейтинг, карточки действия/размера, аккордеон информации, характеристики, липкое меню секций.
- `src/components/pages/Blogger/*` — карточки блогеров (для списка и главной), скелетон.
- `src/components/categories/*` — фильтры категории (панель и drawer), чипы активных фильтров.
- `src/pages/Home.tsx` — главная: карусели товаров, recently viewed, блок популярных блогеров (Spotify) и скелетон при любой загрузке/placeholder данных.
- `src/pages/Catalog.tsx` — каталог с секциями и блоком recently viewed.
- `src/pages/Category.tsx` — категория с фильтрами/сортировкой/чипами; поддерживает проп `presetCategory` (при передаче хлебные крошки скрываются и используется указанная категория).
- `src/pages/Product.tsx` — страница товара: галерея, рейтинг, выбор размера, CTA, аккордеоны, описание/характеристики, подборки по категории и недавно просмотренные, липкое меню секций.
- `src/pages/Bloggers.tsx` — список блогеров (artists из Spotify) с карточками и скелетоном.
- `src/pages/Blogger.tsx` — страница блогера: обложка с тултипом “Verified blogger”, счётчик подписчиков, жанры/описание, соцкнопки, встроенная категория мужской одежды (`Category presetCategory="clothing"`).
- `src/App.tsx` — роутинг Home/Catalog/Category/Product/Bloggers/Blogger, обёртка AppLayout + Toaster.

## Запуск
- Установка: `npm install` (или `npm ci`).
- Дев-сервер: `npm run dev` и открыть URL Vite.
- Билд: `npm run build` (при необходимости перенастроить `tsBuildInfoFile`).

## Переключение API
- `VITE_API_URL` — другой бэкенд (по умолчанию `https://fakestoreapi.com`).
- `VITE_API_TIMEOUT` — таймаут запросов в мс.
- `VITE_SPOTIFY_CLIENT_ID` / `VITE_SPOTIFY_CLIENT_SECRET` — client credentials Spotify (для блоков блогеров). Опционально `VITE_SPOTIFY_ACCESS_TOKEN` для заранее полученного токена.

## Дополнительно
- GH Pages: `npm run deploy` (используется `homepage` в `package.json`).
- CSP: избегайте инлайн-скриптов; все скрипты должны быть модульными (`src/main.tsx`), favicon — с того же origin или добавить домен в `img-src`.
