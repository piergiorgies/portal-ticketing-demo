FROM node:22 

WORKDIR /usr/src/app

COPY . .

RUN npm i --omit=dev

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
