FROM node:lts-alpine3.16
WORKDIR /usr/src/atwiki
RUN npm install yarn
COPY ./atwiki/package*.json ./
COPY ./atwiki .

RUN yarn install && \
    yarn run build && \
    yarn run prisma migrate deploy && \
    yarn run start
