FROM node:18.15.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN yarn
RUN rm -Rf build && yarn run build


FROM --platform=linux/amd64 staderdev/stader-node:v0.3.0-beta as stader

####### Main image

FROM --platform=linux/amd64 node:16.15.0
ARG RP_VERSION

COPY --from=stader /go/bin/stader /go/bin/stader
RUN wget https://dub.sh/linuxamd64 -O /go/bin/stader-cli; chmod u+x /go/bin/stader-cli

RUN mkdir -p /.stader

RUN apt-get -y update && apt-get -y upgrade && apt-get -y install \
    gettext\
    jq \
    nginx \
    sudo \
    supervisor \
    vim-tiny \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -s /bin/false nginx

# Instal node v18.15.0
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . /root/.nvm/nvm.sh \
    && nvm install v18.15.0 \
    && nvm use v18.15.0

# copy wizard & monitor
COPY --from=builder /usr/src/app/wizard/out /usr/local/wizard
COPY --from=builder /usr/src/monitor/ /usr/local/monitor

COPY startRpNode.sh /.stader

COPY user-settings.template /.stader
COPY restart-validator.sh /.stader/scripts/restart-vc.sh
RUN chmod a+x /.stader/startRpNode.sh /.stader/scripts/restart-vc.sh
RUN ln -sf /.stader/scripts/restart-vc.sh /.stader/scripts/stop-vc.sh
RUN ln -sf /.stader/scripts/restart-vc.sh /.stader/scripts/stop-validator.sh

RUN curl "https://iso.ava.do/my.ava.do.crt" --output /etc/nginx/my.ava.do.crt --silent
RUN curl "https://iso.ava.do/my.ava.do.key" --output /etc/nginx/my.ava.do.key --silent

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


