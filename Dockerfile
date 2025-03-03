FROM node:16-slim

WORKDIR /var/www

COPY package*.json ./

RUN npm ci

COPY . .

RUN chmod +x ./start.sh

EXPOSE 3333

CMD ["./start.sh"]
