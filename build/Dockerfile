ARG STADER_VERSION
FROM node:18.15.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn --frozen-lockfile
RUN rm -Rf build && yarn run build

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN yarn --frozen-lockfile
RUN rm -Rf build && yarn run build
RUN rm -Rf node_modules
RUN yarn --production

FROM --platform=linux/amd64 staderdev/stader-node:${STADER_VERSION} as stader

####### Main image

FROM --platform=linux/amd64 node:18.15.0
ARG STADER_VERSION

COPY --from=stader /go/bin/stader /go/bin/stader

RUN mkdir -p /stader

RUN apt-get -y clean && apt-get -y update && apt-get -y upgrade && apt-get -y install \
    gettext\
    jq \
    nginx \
    sudo \
    supervisor \
    vim-tiny \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -s /bin/false nginx

# copy wizard & monitor
COPY --from=builder /usr/src/app/wizard/out /usr/local/wizard
COPY --from=builder /usr/src/monitor/ /usr/local/monitor

COPY startStaderNode.sh /stader

COPY user-settings.template /stader
COPY restart-validator.sh /stader/scripts/restart-vc.sh
RUN chmod a+x /stader/startStaderNode.sh /stader/scripts/restart-vc.sh
RUN ln -sf /stader/scripts/restart-vc.sh /stader/scripts/stop-vc.sh
RUN ln -sf /stader/scripts/restart-vc.sh /stader/scripts/stop-validator.sh

RUN curl "https://iso.ava.do/my.ava.do.crt" --output /etc/nginx/my.ava.do.crt --silent
RUN curl "https://iso.ava.do/my.ava.do.key" --output /etc/nginx/my.ava.do.key --silent

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


