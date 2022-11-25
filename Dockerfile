FROM node:19.1-alpine3.15
LABEL maintainer="deva.kumar@sas.com"
RUN apk add --no-cache --upgrade bash
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
EXPOSE 8080
RUN npm install
#
# You can override these(but in container leave APPHOST as shown below)
# 

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
CMD ["npx", "@sassoftware/registerclient"]