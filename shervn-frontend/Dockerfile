FROM node:16

WORKDIR /frontend/

COPY package*.json ./
RUN yarn

COPY . .

CMD [ "yarn", "run", "build" ]