FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 2206

CMD ["npm", "run", "start:prod"]