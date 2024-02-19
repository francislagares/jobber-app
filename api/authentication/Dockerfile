FROM node:alpine as builder

RUN apk update && apk add --no-cache nodejs && corepack enable
RUN addgroup jobber && adduser -S -G jobber authentication

USER authentication

WORKDIR /authentication

COPY package.json tsconfig.json .npmrc ./
COPY src ./src
COPY tools ./tools

RUN pnpm ci && pnpm build


FROM node:alpine

RUN apk update && apk add --no-cache nodejs && corepack enable
RUN addgroup jobber && adduser -S -G jobber authentication

USER authentication

WORKDIR /authentication

COPY package.json tsconfig.json .npmrc ./
COPY src ./src

RUN pnpm add -g pm2
RUN pnpm ci && pnpm build
RUN pnpm ci --production
COPY --from=builder /authentication/build ./build

EXPOSE 4001

CMD [ "pnpm", "start" ]