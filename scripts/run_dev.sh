echo "begin express server start"
cd /usr/src/atwiki && \
touch log.txt && \
yarn run prisma migrate dev --name init && \
yarn run start 
echo "Successfully runnning!" 