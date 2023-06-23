FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./


RUN pnpm i --frozen-lockfile

# Bundle app source

COPY . .

RUN pnpm build

RUN cd /app/app

RUN pnpm i --frozen-lockfile

RUN pnpm build

WORKDIR /app

EXPOSE 4000

CMD [ "pnpm", "start" ]