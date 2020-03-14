ARG BUILD_FROM=filii/base-node:latest
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Add env
ENV VERSION_TAG="v3.2.4"

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install requirements for add-on and app dependencies
RUN \
    apk add --no-cache \
        ffmpeg=4.2.1-r3 \
    \
    && curl -J -L -o /tmp/archive.zip \
        "https://gitlab.com/filii-lamberti/filiibot_nodejs/-/archive/${VERSION_TAG}/filiibot_nodejs-${VERSION_TAG}.zip" \
    \
    && mkdir -p /tmp/filiibot \
    && unzip -d /tmp/filiibot /tmp/archive.zip \
    && mkdir -p /opt/filiibot \
    \
    && mv /tmp/filiibot/filiibot_nodejs-${VERSION_TAG}/bot.js /opt/filiibot/ \
    && mv /tmp/filiibot/filiibot_nodejs-${VERSION_TAG}/package-lock.json /opt/filiibot/ \
    && mv /tmp/filiibot/filiibot_nodejs-${VERSION_TAG}/package.json /opt/filiibot/ \
    && mv /tmp/filiibot/filiibot_nodejs-${VERSION_TAG}/welcomeDm.txt /opt/filiibot/ \
    \
    && rm -fr /tmp/* \
    \
    && cd /opt/filiibot \
    \
    && npm install \
        --no-optional \
        --only=production \
    \
    && npm cache clear --force \
    \
    && apk del --purge .build-dependencies

# Copy root filesystem
COPY rootfs /

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
    org.label-schema.usage="https://gitlab.com/filii-lamberti/filii-addons/blob/master/filiibot-addon/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://gitlab.com/filii-lamberti/filii-addons" \
    org.label-schema.vendor="Filii Lamberti"