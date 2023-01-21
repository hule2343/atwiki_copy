#!/bin/bash

echo "begin express server start"
cd /usr/src/atwiki && \
yarn run prisma migrate deploy && \
yarn run build && \
yarn run start 
echo "Successfully runnning!" 