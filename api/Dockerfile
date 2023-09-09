FROM node:18-bullseye-slim

WORKDIR /app

COPY *.json ./
COPY src ./src/
COPY entrypoint.sh ./

# NOTE - For now, we rely on the host to mount the public directory
#
# COPY public ./public

RUN npm install

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
