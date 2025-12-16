# Marketplace вещей блогеров

React + TypeScript + Vite проект: i18n, API-слой на axios/TanStack Query, общий хедер, поиск и навигация под маркетплейс перепродажи вещей инфлюенсеров.

## Технологии
- React 19, TypeScript, Vite
- Tailwind (utility-классы), shadcn/ui (InputGroup, Navigation Menu, кнопки)
- i18next + react-i18next (EN/UK, namespaces per page)
- Axios + TanStack React Query (fakestore API)
- Zustand + persist (localStorage для недавно просмотренных)

## Структура
- `src/i18n.ts` — инициализация i18n, namespaces `common`, `home`, `catalog`, `category`.
- `src/locales/{en,uk}/` — переводы (`common.json`, `home.json`, `catalog.json`, `category.json`).
- `src/lib/apiConfig.ts` — базовый URL/таймауты (`VITE_API_URL`, `VITE_API_TIMEOUT`).
- `src/api/client.ts` — axios-инстанс с auth-header.
- `src/api/{products,auth}.ts` — сервисы fakestore.
- `src/hooks/{useProducts,useAuth}.ts` — хуки React Query.
- `src/lib/queryClient.ts` — QueryClient; подключён в `src/main.tsx`.
- `src/components/layout/Header.tsx` — фиксированный хедер с адаптивным поиском (оверлей/кнопка на узких экранах) и навигацией.
- `src/components/layout/Header/Navigation.tsx` — навигация под маркетплейс (дропы, каталог, создатели, продать вещь, FAQ) на Radix Navigation Menu.
- `src/components/layout/Header/SearchBar.tsx` — InputGroup с подсказками (фильтр по товарам, открытия по вводу, закрытие по Esc/клику вне, анимация появления/исчезновения), переход к странице товара по клику на подсказку.
- `src/components/ui/navigation-menu.tsx` — UI-компоненты навигационного меню.
- `src/components/ui/accordion.tsx` — обёртка над Radix Accordion с триггерами и анимацией раскрытия.
- `src/components/layout/Header/SideBar/*` — мобильный/десктоп сайдбар (иконка, кнопки входа/регистрации, аватар в свернутом состоянии, `nav-language.tsx` — переключатель языка в виде дропдауна).
- `src/components/layout/skeletons/HomeSkeleton.tsx` — скелетон главной (секции с карточками) на время загрузки.
- `src/components/layout/skeletons/ProductSkeleton.tsx` — скелетон страницы товара (галерея, рейтинг, CTA/размер/аккордеоны, описание, характеристики).
- `src/components/products/ProductCard.tsx` — карточка товара с фаворит-тогглом (Sonner toast), ховер-эффектом и переходом на страницу товара.
- `src/components/products/ProductCarousel.tsx` — переиспользуемая карусель карточек (autoplay, responsive perRow, peek next, “Смотреть больше” ссылка, стрелки inline/боковые).
- `src/stores/use-viewed-products.ts` — zustand-store с persist в localStorage для недавно просмотренных (используется на Home/Catalog/Product).
- `src/pages/Home.tsx` — главная, тянет тексты из `home`/`common`, выводит товары в карусели (Embla + Autoplay), блок “Recently viewed” и скелетон при загрузке.
- `src/pages/Catalog.tsx` — каталог с секциями по категориям, ссылками “show more” и блоком “Recently viewed”.
- `src/pages/Category.tsx` — категория с полноценными фильтрами (категории/размер/состояние/гендер, диапазон цены со слайдером и инпутами), сортировкой, чипами активных фильтров, sticky панелью на десктопе и drawer на мобильных.
- `src/pages/Product.tsx` — страница товара: галерея, рейтинг, выбор размера, блок продавца/цены/кнопок, аккордеоны с инфо/доставкой/возвратом, описание/характеристики, подборки по категории и недавно просмотренные.
- `src/components/pages/ProductPage/ProductGallery.tsx` — галерея товара на Carousel с полноразмерными слайдами и кликабельными миниатюрами.
- `src/components/pages/ProductPage/RatingStars.tsx` — отрисовка рейтинга (включая половинки).
- `src/components/pages/ProductPage/ProductActionCard.tsx` — блок продавца, цены/стока, CTA “Купити” и фаворит-тоггла.
- `src/components/pages/ProductPage/ProductSizePicker.tsx` — выбор размера с вариантами кнопок.
- `src/components/pages/ProductPage/ProductInfoAccordion.tsx` — аккордеон с информацией/доставкой/возвратом.
- `src/components/categories/CategoryFilters.tsx` — боковая панель фильтров (категория, размер, состояние, гендер, цена).
- `src/components/categories/CategoryFiltersDrawer.tsx` — мобильный/узкий режим: drawer с теми же фильтрами, кнопками Apply/Cancel и чипами выбранных значений.
- `src/constants/filters-presets.ts` — пресеты фильтров с `labelKey` для перевода (категории, размеры, состояние, гендер).
- `src/components/layout/AppLayout.tsx` — общий лейаут приложения (фиксированный хедер, контент с отступом под него, футер, подключение сайдбара).
- `src/components/layout/Footer.tsx` — футер с описанием маркетплейса и ссылками (Marketplace, Support, Company).
- `src/App.tsx` — точка входа, оборачивает страницы в `SidebarProvider` и `AppLayout`; роуты Home/Catalog/Category/Product + Toaster.

## Запуск
- Установка: `npm install` (или `npm ci`).
- Дев-сервер: `npm run dev` и открыть URL Vite.
- Билд: `npm run build` (при необходимости перенастроить `tsBuildInfoFile`).

## Переключение API
- `VITE_API_URL` — другой бэкенд (по умолчанию `https://fakestoreapi.com`).
- `VITE_API_TIMEOUT` — таймаут запросов в мс.

## Дополнительно
- GH Pages: `npm run deploy` (используется `homepage` в `package.json`).
- CSP: избегайте инлайн-скриптов; все скрипты должны быть модульными (`src/main.tsx`), favicon — с того же origin или добавить домен в `img-src`.
