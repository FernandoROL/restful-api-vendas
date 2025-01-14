# JS restful API

Udemy course on building a restful api with node.js, typescript typeorm, postgres, redis and others.

## Features

- Product managing and listing 
- User creation with bcrypt encription

## Requirements

- Node.js
- Docker 
- Postman (or similar: eg. Insomnia) to make the requests

## Project installation

Follow the next steps to clone and setup the project to run locally in your machine

> NOTE: If you are using Windows, I highly reccomend using WSL Ubuntu 

1. #### In the terminal run the folling command to clone the repository by the name `api-vendas-2024`:

```bash
git clone https://github.com/FernandoROL/restful-api-vendas.git api-vendas-2024
```

2. #### Now, access the flder containing the project and run the requirements installation.

```bash
cd api-vendas-2024
npm ci
```

3. #### Use the `.env.example` as a base to create your `.env` and `.env.test` files:

```bash
cp .env.example .env 
cp .env.example .env.test
```

> NOTE: The `.env.example` file should already have all the necessary variables set for the server to run properly

4. #### Create the database with docker compose and run the migrations 

```bash
docker compose up -d
npm run migrations
```

## Running the app

#### Now everything is set! Your can start your api server by just typing the following command in the terminal: 

```bash
npm run dev
```

#### You can access the docs to start building your requests in http://localhost:3333/docs
