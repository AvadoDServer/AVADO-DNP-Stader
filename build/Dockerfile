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

FROM --platform=linux/amd64 staderlabs/stader-permissionless:${STADER_VERSION} as stader
RUN ls -lr /go/bin


# FROM --platform=linux/amd64 node:18.15.0 as stader-cli
# RUN apt-get -y clean && apt-get -y update && apt-get -y upgrade && apt-get -y install \
#     wget \
#     && rm -rf /var/lib/apt/lists/*

# # fetch executable
# RUN wget https://staderlabs.com/eth/releases/stader-node-build/permissionless/v1.1.0/stader-cli-linux-amd64 -O /stader-cli

####### Main image

FROM --platform=linux/amd64 debian:bullseye-slim
ARG STADER_VERSION

RUN mkdir -p /stader


RUN apt update && apt install -y  \
    ca-certificates  \
    gettext\
    jq \
    nginx \
    supervisor \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
RUN echo 'deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x bullseye main' | tee /etc/apt/sources.list.d/nodesource.list
RUN apt update && apt install -y  \
    nodejs \
    && rm -rf /var/lib/apt/lists/*


# RUN apt-get -y clean && apt-get -y update && apt-get -y upgrade && apt-get -y install \
#     gettext\
#     jq \
#     nginx \
#     sudo \
#     supervisor \
#     vim-tiny \
#     && rm -rf /var/lib/apt/lists/*
RUN useradd -s /bin/false nginx

# COPY --from=stader-cli /stader-cli /go/bin/stader
# RUN chmod +x /go/bin/stader

COPY --from=stader /go/bin/stader /go/bin/stader
# RUN chmod +x /go/bin/stader


# copy wizard & monitor
COPY --from=builder /usr/src/app/wizard/out /usr/local/wizard
COPY --from=builder /usr/src/monitor/ /usr/local/monitor

COPY startStaderNode.sh /stader
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY user-settings.template /stader
COPY restart-validator.sh /stader/scripts/restart-vc.sh
RUN chmod a+x /stader/startStaderNode.sh /stader/scripts/restart-vc.sh
RUN ln -sf /stader/scripts/restart-vc.sh /stader/scripts/stop-vc.sh
RUN ln -sf /stader/scripts/restart-vc.sh /stader/scripts/stop-validator.sh

RUN curl "https://iso.ava.do/my.ava.do.crt" --output /etc/nginx/my.ava.do.crt --silent
RUN curl "https://iso.ava.do/my.ava.do.key" --output /etc/nginx/my.ava.do.key --silent

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser appuser

RUN chgrp appuser / && \
    chmod g+w /

WORKDIR /
ENTRYPOINT ["/entrypoint.sh"]


