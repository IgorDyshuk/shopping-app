# Shopping App

React + TypeScript + Vite магазин с базовым каркасом, i18n и общим хедером.

## Технологии

- React 19, TypeScript, Vite
- Tailwind (utility-классы), shadcn/ui за кнопки/комбобокс
- i18next + react-i18next (EN/UK, namespaces по страницам)

## Структура

- `src/i18n.ts` — инициализация i18n, namespaces `common`, `home`.
- `src/locales/{en,uk}/` — переводы, разнесены по файлам `common.json`, `home.json`.
- `src/components/layout/Header.tsx` — общий хедер с переключателем языка.
- `src/components/layout/Header/LanguageSwitcher.tsx` — комбобокс на shadcn/ui, вызывает `i18n.changeLanguage`.
- `src/pages/Home.tsx` — главная страница, тянет тексты из `home` и `common`.
- `src/App.tsx` — оборачивает лейаутом и рендерит страницы.

## Запуск

- Установка: `npm install` (или `npm ci`).
- Дев-сервер: `npm run dev` и открыть URL, который покажет Vite.
- Билд: `npm run build` (при необходимости перенастройте `tsBuildInfoFile` для записи в доступную папку).
