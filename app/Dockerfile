FROM node:current-alpine

ARG WD="/home/smart-root"

WORKDIR ${WD}

RUN apk update && \
    apk add bash git && \
    apk add --upgrade grep

RUN yarn global add expo-cli
RUN yarn global add eas-cli
