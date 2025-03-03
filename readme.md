# Sales restful API

Udemy course on building a sales restful api with node.js, typescript typeorm, postgres, redis and others.

## Features

- Product managing and listing with filtering
- User creation and authentication with bcrypt encription
- User listing with filtering
- Containerized envinronment

## Requirements

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Postman](https://www.postman.com/downloads/) (or similar: eg. [Insomnia](https://insomnia.rest/download)) to make the requests (optional)

## Project installation

Follow the next steps to clone and setup the project to run locally in your machine

> NOTE: If you are using Windows, I highly reccomend using WSL Ubuntu 

1. #### Clone the repository

```bash
git clone https://github.com/FernandoROL/restful-api-vendas.git api-vendas-2024
cd api-vendas-2024
```

2. #### Use the `.env.example` as a base to create your `.env` file

```bash
cp .env.example .env 
```

> NOTE: The `.env.example` file should already have all the necessary variables set for the server to run properly

3. #### Run the docker containers for the application 

```bash
docker compose up -d
```

## Running the app

#### Now everything is set! Your can start using your API in postman or your prefered API platform using the URL: 

```bash
http://localhost:3333/
```
> NOTE: The API swagger documentation can be accessed in: http://localhost:3333/docs

