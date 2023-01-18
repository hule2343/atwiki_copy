FROM node:lts-alpine3.16
WORKDIR /usr/src/atwiki
RUN npm install yarn
COPY ./atwiki .
RUN yarn install
RUN yarn run build 
WORKDIR /usr/src/scripts
COPY ./scripts .
