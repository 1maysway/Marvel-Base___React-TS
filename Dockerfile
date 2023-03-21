# Базовый образ
FROM node:latest as build

# Создайте директорию приложения
WORKDIR /app

# Установите зависимости
COPY package*.json ./
RUN npm config set legacy-peer-deps true
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Облегченный образ Nginx для раздачи статического контента
FROM nginx:alpine

# Копирование сборки из предыдущего образа
COPY --from=build /app/build /usr/share/nginx/html

# Открытие порта 80 для доступа к приложению
EXPOSE 80

# Запуск Nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]


# # Используем образ Node.js как базовый
# FROM node:alpine

# # Установка рабочей директории
# WORKDIR /app

# # Копирование package.json и package-lock.json для установки зависимостей
# COPY package*.json ./

# # Установка зависимостей
# RUN npm install

# # Копирование файлов приложения в образ
# COPY . .

# # Определение переменной окружения для порта приложения
# ENV PORT=80

# # Открытие порта приложения в контейнере
# EXPOSE $PORT

# # Запуск приложения при старте контейнера
# CMD ["npm", "start"]
