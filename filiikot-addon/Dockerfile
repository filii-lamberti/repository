ARG BUILD_FROM=hassioaddons/base:7.0.0
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Add env
ENV VERSION_TAG="v3.0.1"

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install requirements for add-on and app dependencies
RUN \
    apk add --no-cache --virtual .build-dependencies \
        g++=9.2.0-r3 \
        make=4.2.1-r2 \
        python2=2.7.16-r3 \
    \
    && apk add --no-cache \
        nodejs=12.15.0-r1 \
        npm=12.15.0-r1 \
    \
    && curl -J -L -o /tmp/archive.zip \
        "https://gitlab.com/filii-lamberti/filiikot_nodejs/-/archive/${VERSION_TAG}/filiikot_nodejs-${VERSION_TAG}.zip" \
    \
    && mkdir -p /tmp/filiikot \
    && unzip -d /tmp/filiikot /tmp/archive.zip \
    && mkdir -p /opt/filiikot \
    \
    && mv /tmp/filiikot/filiikot_nodejs-${VERSION_TAG}/public /opt/filiikot/ \
    && mv /tmp/filiikot/filiikot_nodejs-${VERSION_TAG}/app.js /opt/filiikot/ \
    && mv /tmp/filiikot/filiikot_nodejs-${VERSION_TAG}/package-lock.json /opt/filiikot/ \
    && mv /tmp/filiikot/filiikot_nodejs-${VERSION_TAG}/package.json /opt/filiikot/ \
    \
    && rm -fr /tmp/* \
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

# Copy root filesystem
COPY rootfs /

# Build arugments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_REF
ARG BUILD_VERSION

# Labels
LABEL \
    io.hass.name="FiliiKot" \
    io.hass.description="A FiliiKot add-on for Hass.io!" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Jorim Tielemans <tielemans.jorim@gmail.com>" \
    org.label-schema.description="A FiliiKot add-on for Hass.io!" \
    org.label-schema.build-date=${BUILD_DATE} \
    org.label-schema.name="FiliiKot" \
    org.label-schema.schema-version="1.0" \
    org.label-schema.url="https://addons.community" \
    org.label-schema.usage="https://gitlab.com/filii-lamberti/filii-addons/blob/master/filiikot-addon/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://gitlab.com/filii-lamberti/filii-addons" \
    org.label-schema.vendor="Filii Lamberti"