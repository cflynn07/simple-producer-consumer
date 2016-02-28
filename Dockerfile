FROM node:5.7.0
ADD ./ /simple-producer-consumer
WORKDIR /simple-producer-consumer
RUN npm install
RUN npm install bunyan json -g
EXPOSE 3001
MAINTAINER Casey Flynn
