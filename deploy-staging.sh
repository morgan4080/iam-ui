#!/bin/bash

CONTAINER_ID=$(docker ps | grep prestaadminui | awk '{ print $1 }')
IMAGE_ID=$(docker image ls | grep prestaadminui | awk '{ print $3 }')

if [ "$CONTAINER_ID" ] && [ "$IMAGE_ID" ]; then
    docker stop "$CONTAINER_ID" &&
     docker rmi "$IMAGE_ID" -f && git pull &&
      docker build --build-arg env=staging -t prestaadminui/latest . &&
       docker run -d -p 4081:80 prestaadminui/latest
else
  git pull && docker build --build-arg env=staging -t prestaadminui/latest . &&
         docker run -d -p 4081:80 prestaadminui/latest
fi
