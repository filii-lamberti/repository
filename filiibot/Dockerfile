ARG BUILD_FROM=hassioaddons/base:2.3.1
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Copy both package.json AND package-lock.json
COPY package*.json /opt/

# Set the current working dir to /opt
WORKDIR /opt

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install requirements for add-on and app dependencies
RUN \
    apk add --no-cache \
        nodejs=8.14.0-r0 \
        npm=8.14.0-r0 \
    \
    && npm install \
        --no-optional \
        --only=production \
    \
    && npm cache clear --force

# Copy app source from rootfs
# app.js, welcomeDm.txt
COPY rootfs .

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
