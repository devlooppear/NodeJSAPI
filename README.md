# NodeJSAPI

This project is a complete NodeJS REST API, dockernized, with postgres, migrations, controllers, reverse proxy, middleware to auth, tests, routes, and seeders

![Node.js](https://img.shields.io/badge/-Node.js-43853d?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ed?logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-2d3748?logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-009639?logo=nginx&logoColor=white)

## Get Started

1. Copy .env.example:

    ```
    cp .env.example .env
    ```
2. Install the dependencies:

    ```
    npm install
    ```
    
3. up docker environment:

    ```
    docker compose up
    ```

- This script automatically runs the environment for production. For development, simply use:

    ```
    npm run dev
    ```

- You also will need uncomment the `docker-compose.yml`

Now that everything is set up, you can access the API at `http://localhost:8080/api/`.

## Auth

To can access this routes you will need create a user and after take your token in personal_access_token. It use Jwt to auth.

## Migrations 

We typically use `npx prisma migrate dev --name init` to initialize migrations. If you need to change the model in the schema.prisma file, you can use `npx prisma migrate reset` followed by `npx prisma migrate dev --name init`.

## Tests

To run test use the command: `npm run test`

## Seeders

To run the seeders you can run `npm run seeders`

## Lint

If you want lint you can use `npm run lint`