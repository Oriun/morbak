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

EXPOSE 4001

CMD [ "pnpm", "start" ]