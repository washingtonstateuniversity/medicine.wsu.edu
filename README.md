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
