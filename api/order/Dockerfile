FROM node:alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && apk add --no-cache nodejs && corepack enable

WORKDIR /order

COPY package.json tsconfig.json .npmrc ./
COPY src ./src

RUN ls -a
RUN pnpm install
RUN rm -f .npmrc
RUN pnpm build



FROM base AS builder

COPY --from=base /order/build ./build

RUN pnpm add -g pm2

EXPOSE 4006

CMD [ "pnpm", "start" ]