FROM node:24.1.0-alpine
LABEL maintainer="deva.kumar@sas.com"
RUN apk add --no-cache --upgrade bash
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN rm .env
EXPOSE 8080
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV PORT=8080
CMD ["npm", "run", "indocker"]