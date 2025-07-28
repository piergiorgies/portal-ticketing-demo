FROM node:22

COPY . .

RUN npm i --omit=dev

RUN npm run build

CMD ["npm", "start"]
