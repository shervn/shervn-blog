FROM node:latest

WORKDIR /frontend/

COPY package*.json ./
RUN yarn

COPY . .

CMD [ "yarn", "run", "build" ]