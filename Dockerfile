FROM node:slim

WORKDIR /var/www

COPY package*.json ./

RUN npm ci
