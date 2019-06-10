# RESTful API with Koa, Passport, Redis, and Postgres

## Docker-izing Postgres and Redis

`docker pull postgres`
`docker pull redis`

`docker start --name redis-container redis`
`docker start --name pg-container postgres`

`docker run -d redis-container`
`docker run -d pg-container`

Execute psql commands: `docker exec -it pg-container psql -U postgres`
* list databases `\l`
* create database: `CREATE DATABASE koa_api;`
* switch to a database `\c koa_api`
* show tables in the current schema `\dt`

Get the ip address of postgres container: 
` docker inspect --format '{{ .NetworkSettings.IPAddress }}' pg-container`

[![Build Status](https://travis-ci.org/mjhea0/node-koa-api.svg?branch=master)](https://travis-ci.org/mjhea0/node-koa-api)

## Want to learn how to build this project?

Check out the following blog posts:

1. [Building a RESTful API with Koa and Postgres](http://mherman.org/blog/2017/08/23/building-a-restful-api-with-koa-and-postgres)
1. [User Authentication with Passport and Koa](http://mherman.org/blog/2018/01/02/user-authentication-with-passport-and-koa)

## Want to use this project?

1. Fork/Clone
1. Install dependencies - `npm install`
1. Fire up Postgres and Redis on the default ports
1. Create two local Postgres databases - `koa_api` and `koa_api_test`
1. Migrate - `knex migrate:latest --env development`
1. Seed - `knex seed:run --env development`
1. Sanity check - `npm start`
1. Test - `npm test`
