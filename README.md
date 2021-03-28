# Clippy

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-clippy.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-clippy) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-clippy.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-clippy) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

This extension integrates the [Clippy.js library by Smore](https://www.smore.com/clippy-js) into Flarum.

You can configure how Clippy should react to various actions on the forum with a combination of animation and/or speach bubble.

The default behavior from the library is preserved: Clippy can be moved around and has some default animations happening randomly and when clicking on it.

## Installation

    composer require clarkwinkelmann/flarum-ext-clippy

## Changing the CDN

The extension does not embed the Clippy library for simplicity and also to avoid dealing with any of the licensing issues.
You can choose where to load the files from using the CDN setting.

**Amazon S3** (default): loads images and sounds from the S3 bucket maintained by Smore.
The javascript and CSS is loaded from jsDelivr because it's not on the S3 bucket.

**jsDelivr**: all resources are loaded from jsDelivr using the automatic GitHub proxy.

**Custom**: you can choose the CDN URL yourself using the **Custom CDN Path** setting.

Steps to host locally:

1. Download the ZIP file from [this link](https://github.com/smore-inc/clippy.js/zipball/master).
2. Extract the content of the file to `<flarum>/public/assets`.
3. Rename the folder to `clippy` (it will likely be called `smore-inc-clippy.js-8bfd1f9` after extraction).
4. In the extension, set **CDN** to *Custom* and **Custom CDN Path** to `/assets/clippy`.
5. If you want, you can delete the `clippy/src` folder, it's not actually used.

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-clippy)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-clippy)
- [Discuss](https://discuss.flarum.org/d/26625)
