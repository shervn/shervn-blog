FROM node:10

# Create app directory
WORKDIR /front

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /front/
RUN npm install --quiet

COPY . /front/

EXPOSE 3000
# CMD [ "node", "server.js" ]