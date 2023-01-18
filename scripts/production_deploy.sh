#!/bin/bash

# 本番サーバをデプロイする
set -eux

REPO_DIR=$(cd $(dirname -- $0) ; pwd)

cd $REPO_DIR
cd ..

#git submodule init
#git submodule update --recursive

# permission を修正する
chmod 777 docker/db/conf.d/

# 古い docker image を削除する
docker image prune -f

docker compose -f docker-compose.yml down --remove-orphans
docker compose -f docker-compose.yml build
docker compose up
