FROM node:20-alpine as CLIENT

WORKDIR /app

RUN npm install -g pnpm

COPY app/package.json ./

COPY app/pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY app ./

RUN pnpm build

FROM node:20-alpine as SERVER

# Create app directory
WORKDIR /morbak

# Install app dependencies
RUN npm install -g pnpm

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

# Bundle app source

COPY . .

RUN pnpm build

COPY --from=CLIENT /app/dist app/dist

EXPOSE 4000

CMD [ "pnpm", "start" ]