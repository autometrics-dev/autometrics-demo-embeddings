FROM node:18-bullseye-slim

WORKDIR /app

COPY *.json ./
COPY src ./src/

# NOTE - For now, we rely on the host to mount the public directory
#
# COPY public ./public

RUN npm install

RUN npm run build

CMD [ "npm", "start" ]
