FROM node
WORKDIR /app
COPY . /app
RUN npm i -g typescript
RUN npm i
RUN tsc
EXPOSE 8080
CMD npm start