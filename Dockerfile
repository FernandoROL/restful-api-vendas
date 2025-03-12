FROM node:slim AS build

WORKDIR /var/www

COPY package*.json ./

RUN npm install

FROM node:slim

WORKDIR /var/www

COPY --from=build /var/www/node_modules ./node_modules
COPY . .

EXPOSE 3333

CMD ["sh", "-c", "./docker/start.sh"]
