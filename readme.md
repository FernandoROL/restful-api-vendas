## JS restful API

Udemy course on building a restful api with node.js, typescript typeorm, postgres, redis and others.

### Installing the project in your PC

Follow the next steps to clone and setup the project to run locally in your machine

> NOTE: If you are using Windows, I highly reccomend using WSL Ubuntu 

1. In the terminal run the folling command to clone the repository by the name `api-vendas-2024`:

```bash
git clone https://github.com/FernandoROL/restful-api-vendas.git api-vendas-2024
```

2. Now, access the flder containing the project and run the requirements installation.

```bash
cd api-vendas-2024

npm ci
```

3. Now you can execute the command `code .` to run vscode inside the folder containing the repository.

4. Copy the `.env.example` file as your `.env` and `.env.test` variables with the following commands:

```bash
cp .env.example .env 
cp .env.example .env.test
```

NOTE: The `.env` files should already have all the necessary variables set for the server to run properly

### Running the app

Now everything is set! Your can start your api server by just typing the following command in the terminal: 

```bash
npm run dev
```
