FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install apidoc -g

# Bundle app source
COPY . /usr/src/app

RM /usr/src/app/config.js
CP /usr/src/app/config.docker.js /usr/src/app/config.js
RM /usr/src/app/config.docker.js

EXPOSE 3000

RUN apidoc -i app/routes -o doc/dist -t doc/template
CMD [ "npm", "start" ]

