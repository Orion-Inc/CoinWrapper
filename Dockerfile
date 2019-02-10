FROM node:8.9-alpine
ENV NODE_ENV production
ENV CLUSTER_DBSTRING 'mongodb+srv://voltron1234:lordbanks_1234@gettingstarted-htylr.gcp.mongodb.net/swap?retryWrites=true'
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8088
CMD npm start