#!/bin/bash

CONTAINER_ID=$(docker ps | grep prestaadminui | awk '{ print $1 }')
IMAGE_ID=$(docker image ls | grep prestaadminui | awk '{ print $3 }')

echo "$CONTAINER_ID"
echo "$IMAGE_ID"

if [ "$CONTAINER_ID" ] && [ "$IMAGE_ID" ]; then
    docker stop "$CONTAINER_ID" &&
     docker rmi "$IMAGE_ID" -f && git pull && git checkout main &&
      docker build --build-arg env=staging -t prestaadminui/latest . &&
       docker run -d -p 9099:80 prestaadminui/latest
else
  git pull && git checkout development && docker build --build-arg env=staging -t prestaadminui/latest . &&
         docker run -d -p 9099:80 prestaadminui/latest
fi