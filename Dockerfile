FROM node:18.16.0

RUN mkdir /home/app

WORKDIR /home/app

ADD package.json /home/app

RUN npm install

ADD . /home/app

EXPOSE 4030

CMD ["npm", "start"]
