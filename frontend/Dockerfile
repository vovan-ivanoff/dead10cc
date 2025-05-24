FROM node:18-alpine AS builder

WORKDIR /app

RUN yarn global add yarn

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn add --dev @types/node

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

RUN yarn global add yarn

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["yarn", "start"]
