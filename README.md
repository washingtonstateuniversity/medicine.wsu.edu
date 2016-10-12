# Elson S. Floyd College of Medicine Theme

[![Build Status](https://travis-ci.org/washingtonstateuniversity/medicine.wsu.edu.svg?branch=master)](https://travis-ci.org/washingtonstateuniversity/medicine.wsu.edu)

## Local Development

From the theme directory on your local machine:

* `composer install` - Install PHPCS packages for use in PHP development.
* `npm install` - Install Node packages for use in CSS and JS development.
* `grunt` - Concatenate the files in `css/*.css`, run [PostCSS](https://github.com/nDmitry/grunt-postcss), run [CSSLint](https://github.com/CSSLint/csslint), and then cleanup.
* `grunt serve` - Start a local web server at `http://localhost:8000`

The `style.css` and `style.css.map` files in the main directory are automatically generated. Build the CSS for this theme in the `css/` directory. As many files as necessary can be added there and will be sequentially concatenated when Grunt runs its tasks.

## Local Style Guide

A set of HTML files is available to help produce a style guide locally.

* `style-guide/front.html` - Example HTML for the front page.
* `style-guide/secondary.html` - Example HTML for secondary pages.
* `style-guide/tertiary.html` - Example HTML for tertiary pages.

Run `grunt serve` to start a local web server. Grunt will watch the CSS files in `css/*.css` and process them any time a file change has been detected. See `Gruntfile.js` for the current list of rules.

# Style guide

## Special typography

`space-case` is a class that shows an alternative way to display a header. The text is spaced and all uppercase. This style also applies a short thin rule under the element. This element will most often be used to lead off a new section after a large graphic element.

In order to center the `space-case` you need to add an additional class of `center`. This will center the text as well as the rule.

### Graphic horizontal rules

`rule` can be added to any element and get the same rule effect that is used for `space-case`.

`rule-thick` can be added to any element, including `space-case`, to procide a thicker rule.

### Blockquotes

When needing a header for a blockquote, add a `<strong>` with a class of `block-head` followed by a soft return (new line)

When citing the source for a blockquote use the `<cite>` tag.

## Features and Bleeds

The `mid-feature` applies a very loose margin and padding to the top and bottom of an element. This element isn't necessary for bled images. Those will use `img-mid-feature`.

There are three different bleed types:
- Full width background color with content, primarily quotes and content callouts.
- An image that bleeds from left window edge to right window edge.
- An image that starts on the left content edge and bleeds off to the right edge of the window.

### Full width background color

`bleed-full` applied to a `<section>` or `section-wrapper` will make that element fill the width of the window. It is recommended to place `bleed-full` on the `section-wrapper` so that the content within the section won't go full width, making it easier to read. If the content needs to go full width, then apply `bleed-full` to the section.

### Image bleeds

*Note:* For images that bleed full or bleed right use `img-mid-feature`. This applies a min-hieght as well as positioning for the background image. 

In addition to using `img-mid-feature` you will need to use `bleed-full` for a full bleed. 

For an image that only bleeds right you will use `bleed-right` instead of `bleed-full`.

### Captions

To display a caption on top of the image use the `caption` class on your element, e.g., `<p>`, `<div>`.

### Colors for background of non-image feature

Use `lightest-back` on the `section-wrapper` or `<section>`, depending on what element you want to go full width. 













