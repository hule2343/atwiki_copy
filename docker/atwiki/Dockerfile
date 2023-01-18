FROM node:lts-alpine3.16
WORKDIR /usr/src/atwiki
RUN npm install yarn
COPY ./atwiki .
RUN yarn install
WORKDIR /usr/src/scripts
COPY ./scripts .
