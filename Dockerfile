FROM node:lts-alpine

RUN npm install -g http-server

RUN apk update && apk add bash

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["http-server", "dist", "-p 8080"]
