# MkDocs add-on for Hass.io.

## Description

This add-on provides an easy way to build and deploy your [MkDocs](https://www.mkdocs.org/) documentation.
By default it installs [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) and other extensions as well.

Supported themes and extensions:

-   mkdocs-material
-   Pygments
-   pymdown-extensions

## Installation

To install this add-on, add the following repository to your ['Hass.io Add-on store'](https://home-assistant.io/hassio/):

`https://gitlab.com/tjorim/hassio-addons`

If you have trouble doing this, you can follow the [official docs](https://home-assistant.io/hassio/installing_third_party_addons/).

Next you should install the "MkDocs" add-on from the Hass.io Dashboard.

## Configuration

Using [Samba](https://home-assistant.io/addons/samba/) or the [SSH & Web Terminal](https://github.com/hassio-addons/addon-ssh) add-on,
create the `/mkdocs` folder in `/share` and place your project in it.
To summarize, `/share/mkdocs` should contain your `mkdocs.yml` and `docs/` folder.

```
share
├───mkdocs
│   │   mkdocs.yml
│   │
│   └───docs
│           index.md
└───̶c̶a̶d̶d̶y
        ̶C̶a̶d̶d̶y̶f̶i̶l̶e
...
```

When started, the add-on will build the documentation and save it to `/share/mkdocs/site`,
next a simple Python HTTP Web server will deploy it on port 8000.

## Customization

By default it will serve the built files on port 8000.
You can change this in the Network options of the add-on.

## Issues

If you have an issue with this add-on or have a feature request, please [file an issue](https://gitlab.com/tjorim/hassio-addons/issues).
If you want to improve the code, fix something, or add extra functionality, feel free to [create a merge request](https://gitlab.com/tjorim/hassio-addons/merge_requests).
