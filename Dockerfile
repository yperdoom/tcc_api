FROM node:18.17.1

RUN mkdir /home/app

WORKDIR /home/app

ADD package.json /home/app

ADD . /home/app

RUN rm -r node_modules

RUN npm install

EXPOSE 4030

CMD npm start
