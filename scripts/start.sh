#!/bin/bash
# export NODE_TLS_REJECT_UNAUTHORIZED=0

FILE=".env"
if [ -f "$FILE" ]; then
    echo "$FILE exists."
    node --env-file=.env  cli.js
else
    echo "$FILE does not exist."
    node cli.js
fi

