FROM node:9

# Essentially running mkdir <name> inside the current working
# directory, and then cd <name>
WORKDIR /usr/src/app

# copy the package.json from your computer, into the 
# current directory inside of the container. Then install
# all the dependencies. Then copy the rest of the files
# recursively into the container.
COPY package.json .
# RUN npm install 
COPY . .

# Expose port 4000 inside the container to the outside world
# so that http://localhost:4000 routes the network traffic to
# the container
EXPOSE 4000

# Expose port 9229 inside the container to allow attaching to
# the nodejs process for setting debug breakpoints
EXPOSE 9229

# the command line to run when the container is started
# TODO make sure migrations run before `npm start`
CMD [ "npx", "knex", "migrate:latest" ]
CMD ["knex" "seed:run" "--env development" ]
CMD [ "npm", "run", "watch" ]
