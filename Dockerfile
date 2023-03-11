FROM node:12

# SETUP
WORKDIR /usr/src/app
RUN mkdir packages && mkdir packages/web && mkdir packages/server
COPY packages/server/.env packages/server/.env
COPY packages/server/.env packages/web/.env

# WEB
WORKDIR /usr/src/app/packages/web
COPY packages/web/package.json ./
COPY packages/web/yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY packages/web ./
RUN yarn build

# APP
WORKDIR /usr/src/app/packages/server
COPY packages/server/package.json ./
COPY packages/server/yarn.lock ./
COPY packages/server/tsconfig.json ./tsconfig.json
RUN yarn install --frozen-lockfile --production
COPY packages/server ./
RUN yarn build:tsc

# RUN
# TODO: Use pm2
WORKDIR /usr/src/app/packages/server
EXPOSE 8080
CMD [ "node", "dist/index.js" ]