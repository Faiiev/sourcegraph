FROM alpine:3.10@sha256:e4355b66995c96b4b468159fc5c7e3540fcef961189ca13fee877798649f531a AS ctags

# hadolint ignore=DL3003,DL3018,DL4006
RUN apk --no-cache add --virtual build-deps curl jansson-dev \
    libseccomp-dev linux-headers autoconf pkgconfig make automake \
    gcc g++ binutils

ENV CTAGS_VERSION=03f933a96d3ef87adbf9d167462d45ce69577edb

# hadolint ignore=DL3003
RUN curl -fsSL -o ctags.tar.gz "https://codeload.github.com/universal-ctags/ctags/tar.gz/$CTAGS_VERSION" && \
    tar -C /tmp -xzf ctags.tar.gz && cd /tmp/ctags-$CTAGS_VERSION && \
    ./autogen.sh && LDFLAGS=-static ./configure --program-prefix=universal- --enable-json --enable-seccomp && \
    make -j8 && make install && cd && \
    rm -rf /tmp/ctags-$CTAGS_VERSION && \
    apk --no-cache --purge del build-deps

# TODO: Make this image use our sourcegraph/alpine:3.9 base image (3.10?).
FROM alpine:3.10@sha256:e4355b66995c96b4b468159fc5c7e3540fcef961189ca13fee877798649f531a

ARG COMMIT_SHA="unknown"
ARG DATE="unknown"
ARG VERSION="unknown"

LABEL org.opencontainers.image.revision=${COMMIT_SHA}
LABEL org.opencontainers.image.created=${DATE}
LABEL org.opencontainers.image.version=${VERSION}
LABEL com.sourcegraph.github.url=https://github.com/sourcegraph/sourcegraph/commit/${COMMIT_SHA}

RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.6/main" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.6/community" >> /etc/apk/repositories

# hadolint ignore=DL3018
RUN apk update && apk add --no-cache \
    # NOTE that the Postgres version we run is different
    # from our *Minimum Supported Version* which alone dictates
    # the features we can depend on. See this link for more information:
    # https://github.com/sourcegraph/sourcegraph/blob/master/doc/dev/postgresql.md#version-requirements
    'bash=5.0.0-r0' 'postgresql-contrib=11.6-r0' 'postgresql=11.6-r0' \
    'redis=3.2.12-r0' bind-tools ca-certificates git@edge \
    mailcap nginx openssh-client pcre su-exec tini nodejs-current=12.4.0-r0

# IMPORTANT: If you update the syntect_server version below, you MUST confirm
# the ENV variables from its Dockerfile (https://github.com/sourcegraph/syntect_server/blob/master/Dockerfile)
# have been appropriately set in cmd/server/shared/shared.go.
# hadolint ignore=DL3022
COPY --from=comby/comby:0.12.1@sha256:cf2c1da47c513e664b28390ababc1e55f4e7c255fb1dd49e9879f1d126294398 /usr/local/bin/comby /usr/local/bin/comby
# hadolint ignore=DL3022
COPY --from=sourcegraph/syntect_server:2b5a3fb@sha256:ef5529cafdc68d5a21edea472ee8ad966878b173044aa5c3db93bc3d84765b1f /syntect_server /usr/local/bin/
COPY --from=ctags /usr/local/bin/universal-* /usr/local/bin/
# hadolint ignore=DL3022
COPY --from=sourcegraph/lsif-server:ci /lsif /lsif

# hadolint ignore=DL3022
COPY --from=sourcegraph/prometheus:10.0.6@sha256:f681ceb9400f0d546601cbf827ac9c3db16acd37e810da0860cf05d4f42305d1 /bin/prometheus /usr/local/bin
# hadolint ignore=DL3022
COPY --from=sourcegraph/prometheus:10.0.6@sha256:f681ceb9400f0d546601cbf827ac9c3db16acd37e810da0860cf05d4f42305d1 /usr/share/prometheus /usr/share/prometheus

# hadolint ignore=DL3018
RUN set -ex && \
    addgroup -S grafana && \
    adduser -S -G grafana grafana && \
    apk add --no-cache libc6-compat=1.1.24-r0 ca-certificates su-exec

# hadolint ignore=DL3022
COPY --from=sourcegraph/grafana:10.0.9@sha256:0132e5602030145803753468497a2d17640164b9c34df4ce2532dd93e4b1f6fc /usr/share/grafana /usr/share/grafana

# hadolint ignore=DL3022
COPY --from=libsqlite3-pcre /sqlite3-pcre/pcre.so /libsqlite3-pcre.so
ENV LIBSQLITE3_PCRE /libsqlite3-pcre.so
COPY . /

# hadolint ignore=DL3022
COPY --from=sourcegraph/grafana:10.0.9@sha256:0132e5602030145803753468497a2d17640164b9c34df4ce2532dd93e4b1f6fc /sg_config_grafana/provisioning/dashboards/sourcegraph/*json /sg_config_grafana/provisioning/dashboards/sourcegraph/

# hadolint ignore=DL3022
COPY --from=wrouesnel/postgres_exporter:v0.7.0@sha256:785c919627c06f540d515aac88b7966f352403f73e931e70dc2cbf783146a98b /postgres_exporter /usr/local/bin/postgres_exporter

RUN echo "hosts: files dns" > /etc/nsswitch.conf

ENV GO111MODULES=on LANG=en_US.utf8
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/server"]
