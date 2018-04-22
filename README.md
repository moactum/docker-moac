# docker-moac
MOAC docker image based on ubuntu 1804 x64

- this docker images was built with binaries and sample configurations from http://daszichan.com/downloads/moac
- it contains binaries: moac, open-moac-pool
- it contains sample configuration files: proxy.json, payout.json, mctest.js, environment.js
- it contains parts (optionally) for functionality: redis-server, nginx, nvm

# relates
- https://github.com/MOACChain
- https://github.com/happyxie/open-moac-pool

# usage
- supporting staff
  - [redis-server]
    - needed by mining pool backend proxies and api
  - [nginx]
    - needed by mining pool frontend web page
- moac wallet/console/vnode
  - /root/moac [--testnet] [--rpc [--rpcaddr 0.0.0.0]] [--mine] [console]
- moac vnode mining proxies and/or api
  - [customize]
    - /root/proxy.json
  - [run]
    - redis-server &
    - /root/open-moac-mining /root/proxy.json

- frontend webpages for vnode mining / api endpoints / payments
  - [customize]
    - /root/build/open-moac-pool/www/config/environment.js
  - [build]
    - nvm install --lts=carbon ; npm install -g bower;  cd /root/build/open-moac-pool/www; git pull; rm -fr dist; npm install ; bower install --allow-root; ./build.sh
  - [web]
    - nginx

- the better way for docker is to create multiple instances in a user created network:
  - create docker network, run once only on the host
    - docker network create moac
  - create vnode instance with name vnode
    - docker run --name vnode --network moac lospringliu/moac
      - /root/moac [--testnet] [--rpc [--rpcaddr 0.0.0.0]] [console]
  - create proxy instance with name proxy (a redis server instance named redis)
    - docker run --name redis --network moac redis:alpine
    - docker run --name proxy -p 8888:8888 -p 8008:8008 --network moac lospringliu/moac
      - /root/open-moac-pool /root/proxy.json
  - create web instance with name web
    - docker run --name web -p 80:80 --network moac lospringliu/moac
      - nginx
      - modify /root/build/open-moac-pool/www/config/environment.js
      - nvm install --lts=carbon ; npm install -g bower;  cd /root/build/open-moac-pool/www; git pull; rm -fr dist; npm install ; bower install --allow-root; ./build.sh
  - to enable automatic payout
    - create vnode instance with name vnode2
      - docker run --name vnode2 --network moac lospringliu/moac
        - /root/moac [--testnet] [--rpc [--rpcaddr 0.0.0.0]] [console]
    - create payout instance with name payout
      - docker run --name payout --network moac lospringliu/moac
        - modify  /root/payout.json
        - /root/open-moac-pool /root/payout.json

# you can read online https://github.com/lospringliu/docker-moac
