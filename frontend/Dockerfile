FROM node:18-alpine AS builder

WORKDIR /app

RUN if [ "$(uname -s)" = "Linux" ] || [ "$(uname -s)" = "Darwin" ]; then \
      apk add --no-cache curl unzip && \
      npm install -g bun; \
    else \
      curl -fsSL https://bun.sh/install | bash; \
    fi

COPY package.json bun.lockb ./

RUN bun install

RUN bun add --dev @types/node

COPY . .

RUN bunx next build

FROM node:18-alpine

WORKDIR /app

RUN if [ "$(uname -s)" = "Linux" ] || [ "$(uname -s)" = "Darwin" ]; then \
      apk add --no-cache curl unzip && \
      npm install -g bun; \
    else \
      curl -fsSL https://bun.sh/install | bash; \
    fi

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["bunx", "next", "start"]
