FROM node:10

WORKDIR /frontend/

COPY package*.json ./
RUN npm install --quiet

COPY . .

CMD [ "yarn", "run", "build" ]