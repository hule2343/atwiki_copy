#!/usr/bin/env bash

# 本番サーバをデプロイする

set -eux

REPO_DIR=$(cd `dirname $0`; cd ..; pwd)

cd $REPO_DIR


#git submodule init
#git submodule update --recursive

# permission を修正する
chmod 775 docker/db/conf.d/

# 古い docker image を削除する
docker image prune -f

docker-compose -f docker-compose.yaml down --remove-orphans
docker-compose -f docker-compose.yaml build
docker-compose -f docker-compose.yaml up -d

echo 'デプロイ完了!!'
Foo