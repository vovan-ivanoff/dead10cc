FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install -g yarn --force

RUN yarn install --frozen-lockfile --prefer-offline

COPY . .

ENV NEXT_ESLINT_IGNORE_DURING_BUILDS=true

RUN yarn build --no-lint

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app/

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

RUN yarn cache clean

CMD ["yarn", "start"]
