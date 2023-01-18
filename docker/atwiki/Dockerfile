FROM node:lts-alpine3.16
WORKDIR /usr/src/atwiki
RUN npm install yarn
COPY ./atwiki/public ./public
COPY ./atwiki/routes ./routes
COPY ./atwiki/src ./src
COPY ./atwiki/.env .
COPY ./atwiki/app.ts .
COPY ./atwiki/log.txt .
COPY ./atwiki/package.json .
COPY ./atwiki/tsconfig.json .
COPY ./atwiki/yarn.lock .
RUN yarn install
RUN yarn run prisma init
COPY ./atwiki/prisma/schema.prisma ./prisma/schema.prisma
WORKDIR /usr/src/scripts
COPY ./scripts .
