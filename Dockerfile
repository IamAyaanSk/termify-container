FROM ubuntu:latest

RUN apt update -y && apt upgrade -y && apt-get install -y ca-certificates curl gnupg --no-install-recommends 

RUN mkdir -p /etc/apt/keyrings

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

RUN apt update -y

RUN apt-get install -y nodejs git make python3 build-essential --no-install-recommends 

RUN npm install -g pnpm

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

COPY . /root/server

WORKDIR /root/server

RUN pnpm install && pnpm build

RUN adduser damner --disabled-password --gecos ""

USER damner

WORKDIR /home/damner

RUN mkdir /home/damner/code 

WORKDIR /home/damner/code

RUN touch main.js

USER root

WORKDIR /root/server

EXPOSE 3000

CMD [ "pnpm", "start" ]