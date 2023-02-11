FROM node:lts-alpine3.16
WORKDIR /usr/src/atwiki
RUN npm install yarn
COPY ./atwiki/public ./public
COPY ./atwiki/routes ./routes
COPY ./atwiki/src ./src
COPY ./atwiki/.env .
COPY ./atwiki/app.ts .
COPY ./atwiki/package.json .
COPY ./atwiki/tsconfig.json .
COPY ./atwiki/yarn.lock .
COPY ./atwiki/prisma ./prisma
RUN yarn install
WORKDIR /usr/src/scripts
COPY ./scripts .