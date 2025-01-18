#------------------------------------------------------
# Setup Node.js environment for application deployment
#------------------------------------------------------

FROM node:22.13.0-bookworm

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
COPY src ./src

RUN npm ci

HEALTHCHECK --interval=10s --timeout=3s CMD wget --quiet --spider --tries=1 127.0.0.1:${PORT}/healthcheck || exit 1

CMD ["npm", "start"]
