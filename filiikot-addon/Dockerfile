ARG BUILD_FROM=hassioaddons/base:5.0.1
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Add env
ENV VERSION_TAG="v2.0.0"

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Copy root filesystem
COPY rootfs /

# Install requirements for add-on and app dependencies
RUN \
    apk add --no-cache --virtual .build-dependencies \
        g++=8.3.0-r0 \
        make=4.2.1-r2 \
        python2=2.7.16-r1 \
    \
    && apk add --no-cache \
        nodejs=10.14.2-r0 \
        npm=10.14.2-r0 \
    \
    && cd /opt/filiikot \
    \
    && npm install \
        --no-optional \
        --only=production \
    \
    && npm cache clear --force \
    \
    && apk del --purge .build-dependencies

# Exposing the application's port
EXPOSE 8212

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