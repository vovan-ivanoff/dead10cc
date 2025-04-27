FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bunx next build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g bun

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["bunx", "next", "start"]
