FROM node:18.16.0

RUN mkdir /home/app

WORKDIR /home/app

ADD package.json /home/app

ADD . /home/app

RUN rm -r node_modules

RUN npm install

EXPOSE 4030

CMD npm start
