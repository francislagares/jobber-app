FROM node:alpine AS builder

RUN apk update && apk add --no-cache nodejs && corepack enable
RUN addgroup jobber && adduser -S -G jobber users

USER users

WORKDIR /users

COPY package.json tsconfig.json .npmrc ./
COPY src ./src
COPY tools ./tools

RUN pnpm ci && pnpm build


FROM node:alpine

RUN apk update && apk add --no-cache nodejs && corepack enable
RUN addgroup jobber && adduser -S -G jobber users

USER users

WORKDIR /users

COPY package.json tsconfig.json .npmrc ./
COPY src ./src

RUN pnpm add -g pm2
RUN pnpm ci && pnpm build
RUN pnpm ci --production
COPY --from=builder /users/build ./build

EXPOSE 4003

CMD [ "pnpm", "start" ]