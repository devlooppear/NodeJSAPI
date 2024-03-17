# NodeJSAPI

This project is a Node.js REST API with Docker. It uses PostgreSQL and Prisma for migrations. Currently, it lacks tests and authentication to be considered a complete REST API with the potential to support large-scale systems. I will be working on adding these features, as well as incorporating Nginx and other enhancements, also putting the request validations.


![Node.js](https://img.shields.io/badge/-Node.js-43853d?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ed?logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-2d3748?logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white)

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

Now that everything is set up, you can access the API at `http://localhost:3000/api/`.

## Migrations 

We typically use `npx prisma migrate dev --name init` to initialize migrations. If you need to change the model in the schema.prisma file, you can use `npx prisma migrate reset` followed by `npx prisma migrate dev --name init`.

## Seeders

To run the seeders you can run `npm run seeders`

## Lint

If you want lint you can use `npm run lint`