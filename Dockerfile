FROM node:20-alpine

WORKDIR /reon

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY ./src ./src

RUN npm ci