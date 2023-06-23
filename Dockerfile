FROM node:20

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

WORKDIR /morbak/app

RUN pnpm i --frozen-lockfile

RUN pnpm build

WORKDIR /morbak

EXPOSE 4000

CMD [ "pnpm", "start" ]