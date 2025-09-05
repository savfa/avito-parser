# Avito Parser с уведомлениями в Telegram

Этот проект парсит объявления с Avito и отправляет уведомления о новых объявлениях в Telegram.

## Настройка

1. Установите зависимости:
```bash
npm install
```

2. Настройте базу данных PostgreSQL в файле .env:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=avito_parser_db
DB_SYNCHRONIZE=true
```

3. Создайте Telegram бота:
   - Найдите в Telegram бота @BotFather
   - Отправьте команду /newbot и следуйте инструкциям
   - Сохраните полученный токен

4. Получите ваш chat_id:
   - Найдите в Telegram бота @userinfobot или @getidsbot
   - Напишите ему любое сообщение
   - Скопируйте ваш chat_id из ответа

5. Добавьте токен и chat_id в файл .env:
```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
```

6. Запустите приложение:
```bash
npm run start:dev
```

## Использование

- Для добавления ключевого слова для мониторинга:
  ```
  POST /avito-parser/add-keyword/{keyword}
  ```

- Для ручного запуска парсинга по ключевому слову:
  ```
  POST /avito-parser/parse/{keyword}
  ```

- Автоматический парсинг выполняется каждые 2 часа для всех активных ключевых слов

## Структура проекта

- `src/avito-parser/` - основной модуль парсера
- `src/telegram/` - сервис для работы с Telegram API
- `.env` - конфигурационный файл
