FROM ubuntu:xenial

MAINTAINER Xinchun Liu <lospringliu@gmail.com>

RUN apt-get update && apt-get install -y locales wget iputils-ping net-tools vim git psmisc screen redis-server nginx 

RUN locale-gen "en_US.UTF-8"
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
RUN mkdir -p /root/build && cd /root/build && chmod 755 /root && git clone https://github.com/happyxie/open-moac-pool.git && mkdir /root/build/open-moac-pool/www/dist

COPY default /etc/nginx/sites-available/default
COPY mctest.js *json environment.js .gitconfig README /root/
COPY dist/ /root/build/open-moac-pool/www/dist

RUN wget -q -O /root/moac http://daszichan.com/downloads/moac/moac && wget -q -O /root/open-moac-pool http://daszichan.com/downloads/moac/open-moac-pool
#COPY moac open-moac-pool /root/

RUN chmod +x /root/open-moac-pool /root/moac
RUN cd /var/www && rm -fr html && ln -s /root/build/open-moac-pool/www/dist html
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash


EXPOSE 8080 8888 8008 80
CMD ["/bin/bash"]
