FROM node:22.16-alpine
LABEL maintainer="deva.kumar@sas.com"
RUN apk add --no-cache --upgrade bash
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
EXPOSE 8081
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV PORT=8081
CMD ["npm", "start"]