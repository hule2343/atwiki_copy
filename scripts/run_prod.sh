#!/bin/bash

echo "Waiting for mysql to start..."
cd /usr/src/atwiki && yarn run prisma migrate deploy && yarn run start 
echo "Successfully runnning!" 