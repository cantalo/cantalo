FROM node:12

WORKDIR /app

COPY ./ ./

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["node", "__sapper__/build"]