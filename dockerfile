# ใช้ official Bun image
# ดู versions ทั้งหมดได้ที่ https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Stage สำหรับติดตั้ง dependencies
# จะ cache dependencies เพื่อให้ build เร็วขึ้นในครั้งต่อไป
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# ติดตั้ง production dependencies (ไม่รวม devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Final production stage (รัน TypeScript โดยตรง)
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
# คัดลอก source code และไฟล์ที่จำเป็น
COPY src ./src
COPY package.json .
COPY tsconfig.json .

# สร้าง non-root user เพื่อความปลอดภัย
USER bun

# เปิด port 3000
EXPOSE 3000/tcp

# รัน TypeScript โดยตรง (หลีกเลี่ยงปัญหา bundling)
ENTRYPOINT ["bun", "run", "src/server.ts"]