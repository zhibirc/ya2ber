#------------------------------------------------------
# Setup Node.js environment for application deployment
#------------------------------------------------------

FROM node:16.16.0

ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
COPY src ./src

RUN npm ci

LABEL maintainer="Yaroslav Surilov <zhibirc.echo@gmail.com>"
HEALTHCHECK --interval=10s --timeout=3s CMD wget --quiet --spider --tries=1 127.0.0.1:${PORT}/healthcheck || exit 1

EXPOSE ${PORT}/TCP

CMD ["npm", "run", "start:prod"]
