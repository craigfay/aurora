## Docker Commands
* Build image `docker-compose build`
* Start image as container `docker-compose up`
* Run psql inside the postgres container `docker exec -it database psql -U postgres`

## PSQL Commands
* list databases `\l`
* create database: `CREATE DATABASE koa_api;`
* switch to a database `\c koa_api`
* show tables in the current schema `\dt`

Resources:
* [Productive with Docker in 20 Minutes](https://engineering.circle.com/productive-with-docker-in-20-minutes-8997297a35bb)

* [Building a RESTful API with Koa and Postgres](http://mherman.org/blog/2017/08/23/building-a-restful-api-with-koa-and-postgres)

* [User Authentication with Passport and Koa](http://mherman.org/blog/2018/01/02/user-authentication-with-passport-and-koa)

* [API testing with Jest](https://hackernoon.com/api-testing-with-jest-d1ab74005c0a)

* [Migrations with Docker](https://stackoverflow.com/questions/33992867/how-do-you-perform-django-database-migrations-when-using-docker-compose)

* [How is Docker Different from a VM?](https://stackoverflow.com/questions/16047306/how-is-docker-different-from-a-virtual-machine?rq=1)

* [Cookie Max-Age vs Expires](https://mrcoles.com/blog/cookies-max-age-vs-expires/)

* [Lets Encrypt with Koa](http://blog.bguiz.com/2015/12/17/letsencrypt-tls-certs-nodejs/)

* [DigitalOcean on SSL](https://www.digitalocean.com/community/tutorials/how-to-use-certbot-standalone-mode-to-retrieve-let-s-encrypt-ssl-certificates-on-debian-9)

* [Nginx and Apache with Node](https://www.quora.com/When-using-node-js-do-you-still-need-Nginx-or-Apache)

## Todo
* Add close() methods for db and cache
* Allow shorthand HttpResponse construction
* Investigate 'Bad Request' response on malformed JSON requests (probably koa?)
* Have a more thoughtfull directory structure for the volumes in Docker
* Investigate @koa/cors and when it's necessary
* Investigate deploying only a Docker image that clones in all supporting files
* Add an entrypoint.js type module for running migrations etc..
* Maybe use GMT format for cookie.expires

## Unanswered Questions
* How can database content be persistent accross image/container destruction?
* When is database content destroyed, and where is it contained?
* How and when should migration/seeding be performed?
* What's the best way to dependency-invert knex?
* What tools are available for automated semantic versioning?
