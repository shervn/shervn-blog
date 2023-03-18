FROM node:14

WORKDIR /frontend/

COPY package*.json ./
RUN yarn

COPY . .

CMD [ "yarn", "run", "build" ]