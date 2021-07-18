FROM node:16.5.0-alpine3.11 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .
RUN yarn build

FROM node:16.5.0-alpine3.11 AS ruuner

COPY package.json yarn.lock ./
RUN yarn --production --frozen-lockfile

COPY --from=builder /app/dist .

CMD node main.js
