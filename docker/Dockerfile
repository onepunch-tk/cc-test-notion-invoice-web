# Node.js 서버용 Dockerfile (최적화 버전)
# 3단계 멀티 스테이지 빌드로 이미지 크기 최소화

# Stage 1: Build (의존성 설치 + 빌드)
FROM oven/bun:1.3 AS builder

WORKDIR /app

# 의존성 먼저 복사 (캐시 레이어 활용)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY . .
ENV PLATFORM=node
RUN bun run build:node

# Stage 2: Production Dependencies
FROM oven/bun:1.3 AS production-deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 3: Production (Node.js 런타임)
FROM node:22-alpine AS production

WORKDIR /app

# 필요한 파일만 복사
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=production-deps /app/node_modules ./node_modules

# 환경 변수 및 포트 설정
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# 서버 시작
CMD ["node", "./build/server/index.js"]
