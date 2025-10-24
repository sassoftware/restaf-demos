FROM node:22.16-alpine
LABEL maintainer="deva.kumar@sas.com"
RUN apk add --no-cache --upgrade bash
WORKDIR /usr/src/app
COPY package*.json ./
COPY src ./src
COPY tls ./tls
COPY .npmrc ./npmrc
COPY LICENSE ./LICENSE
COPY README.md ./README.md
EXPOSE 8080
# RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV PORT=8080
ENV HTTPS=FALSE
ENV MCPTYPE=http
ENV TLS_CREATE="C:US,ST:NC,L:Cary,O:SAS Institute,OU:STO,CN:localhost"
CMD ["npm", "start"]