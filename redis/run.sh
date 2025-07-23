#!/bin/bash
# docker rm -f redis
# docker rm -f redissub
# docker network rm redisnet
# docker network create redisnet
docker rm -f 
docker-compose -f compose.yaml up -d