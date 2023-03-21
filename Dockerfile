# # Базовый образ
# FROM node:latest as build

# # Создайте директорию приложения
# WORKDIR /app

# # Установите зависимости
# COPY package*.json ./
# RUN npm config set legacy-peer-deps true
# RUN npm install

# # Копирование исходного кода
# COPY . .

# # Сборка приложения
# RUN npm run build

# # Облегченный образ Nginx для раздачи статического контента
# FROM nginx:alpine

# # Копирование сборки из предыдущего образа
# COPY --from=build /app/build /usr/share/nginx/html

# # Открытие порта 80 для доступа к приложению
# EXPOSE 80

# # Запуск Nginx в фоновом режиме
# CMD ["nginx", "-g", "daemon off;"]


FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . .

CMD ["npm", "start"]
