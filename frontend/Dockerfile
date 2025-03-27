FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install -g yarn

RUN yarn install --frozen-lockfile --prefer-offline

COPY . .

RUN yarn build --no-lint

RUN yarn install --production --frozen-lockfile

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app/

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["yarn", "start"]
