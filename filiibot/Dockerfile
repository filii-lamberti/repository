ARG BUILD_FROM=hassioaddons/base:2.3.1
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Add env
ENV ACCESS_TOKEN="***REMOVED***" \
    COMMIT_SHA="v2.1.2"

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install requirements for add-on and app dependencies
RUN \
    apk add --no-cache \
        g++=6.4.0-r9 \
        make=4.2.1-r2 \
        nodejs=8.14.0-r0 \
        npm=8.14.0-r0 \
        python2=2.7.15-r1 \
    \
    && curl -H "PRIVATE-TOKEN: ${ACCESS_TOKEN}" -J -L -o /tmp/archive.zip \
        "https://gitlab.com/api/v4/projects/7715575/repository/archive.zip?sha=${COMMIT_SHA}" \
    \
    && unzip /tmp/archive.zip \
        "*/bot.js" \
        "*/package-lock.json" \
        "*/package.json" \
        "*/welcomeDm.txt" \
        -d /tmp/filiibot \
    \
    && mkdir -p /opt/filiibot \
    \
    && mv /tmp/filiibot/bot.js /opt/filiibot/ \
    && mv /tmp/filiibot/package-lock.json /opt/filiibot/ \
    && mv /tmp/filiibot/package.json /opt/filiibot/ \
    && mv /tmp/filiibot/welcomeDm.txt /opt/filiibot/ \
    \
    && rm -fr /tmp/*
    \
    && cd /opt/filiibot \
    \
    && npm install \
        --no-optional \
        --only=production \
    \
    && npm cache clear --force

# Copy root filesystem
COPY rootfs /

# Exposing the application's port
EXPOSE 8212

# And finally start it
CMD [ "node", "bot.js" ]

# Build arugments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_REF
ARG BUILD_VERSION

# Labels
LABEL \
    io.hass.name="FiliiBot" \
    io.hass.description="A FiliiBot add-on for Hass.io!" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Jorim Tielemans <tielemans.jorim@gmail.com>" \
    org.label-schema.description="A FiliiBot add-on for Hass.io!" \
    org.label-schema.build-date=${BUILD_DATE} \
    org.label-schema.name="FiliiBot" \
    org.label-schema.schema-version="1.0" \
    org.label-schema.url="https://addons.community" \
    org.label-schema.usage="https://gitlab.com/tjorim/hassio-addons/blob/master/filiibot/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://gitlab.com/tjorim/hassio-addons" \
    org.label-schema.vendor="Filii Lamberti"
