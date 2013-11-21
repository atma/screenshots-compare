Installation
============

Before you begin plase install [Node.js](http://nodejs.org/) and [GraphicsMagick](http://www.graphicsmagick.org/README.html#installation). Install [PhantomJS](http://phantomjs.org/download.html) and add PhantomJS executable in PATH.

Clone this repo by running `git clone https://github.com/atma/template-benchmark.git` or use some application with GUI to manage github repos, [Github for Windows](https://windows.github.com/) for example.

Go to the repo and run `npm install`. Copy `config.json.sample` to `config.json` and configure your datasets.


Usage
=====

Generate reference images for all datasets.

    node reference.js

Generate reference images for specific dataset using custom domain.

    node reference.js --dataset google --host www.google.com

Generate comparison results for all datasets.

    node compare.js

Generate comparison results for specific dataset using custom domain.

    node compare.js --dataset google --host www.google.com

Generate comparison results for specific image using custom domain and viewport size. Viewport size can be configured in `config.json`.

    node compare.js --host www.google.com --image home --viewport large

Generate comparison results with a custom diff color, default is `red`.

    node compare.js --host www.google.com --color green
