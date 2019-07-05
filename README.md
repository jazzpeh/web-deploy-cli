[![Build Status](https://travis-ci.org/jazzpeh/web-deploy-cli.svg?branch=master)](https://travis-ci.org/jazzpeh/web-deploy-cli)
[![npm version](https://badge.fury.io/js/web-deploy-cli.svg)](https://badge.fury.io/js/web-deploy-cli)

# Web Deploy CLI

This package makes it easy to deploy static web applications. It does this by exposing a small set of easy-to-use CLI commands and arguments to quickly  deploy your entire project. 

Currently it supports the following cloud deployment service:
* AWS S3 Static Website Hosting

## Table of Contents

1. [Dependencies](#dependencies)
   * [node](#node)
2. [Installation](#installation)
3. [CLI Commands](#cli-commands)
    * [Deploy to AWS S3](#deploy-to-aws)
4. [Release Notes](#release-notes)
5. [Contribution](#contribution)
    * [Getting Started](#getting-started)
5. [More Information](#more-information)
    * [Small Print](#small-print)
6. [License](#license)

## Dependencies
<a name="dependencies"></a>

### Node
<a name="node"></a>

This package requires `Node >= 8.0**`.

You can install [Node.js](http://www.nodejs.org/) via the package provided on [their site](http://www.nodejs.org).
Installing node will also install the [Node Package Manager](https://github.com/npm/npm) (NPM) to download and
install node modules.

## Installation
<a name="installation"></a>

Installing Build Tools as a global module will give you command-line access to all tasks available.

You can install globally by typing the following in your terminal:

```
npm install web-deploy-cli  -g
```

To verified that it is successfully installed, run this:

```
web-deploy --version
```

## Deploy to AWS S3
<a name="deploy-to-aws"></a>

You can use this command to deploy your static web application to AWS S3 bucket:

```
web-deploy --args=<values>
```

Arguments allowed are:

| Argument | Type | Description |
|--------|--------|--------|
| `bucket` | String | The bucket name for AWS S3
| `profile`| String? | The profile name for AWS credentials (if nothing is passed, `profile` will be set to `default`)
| `dir`| String | The absolute path to your project directory (if nothing is passed, it will use the current directory of the terminal process)
| `folder` | String? | Specify the folder that contains the built static web application `i.e. build`

Example usage of arguments:

```
web-deploy --bucket=john-doe-bucket --dir=/Users/johndoe/Projects/hello_world --folder=build
```

## Release Notes
<a name="release-notes"></a>

Please refer to the [Github releases section for the changelog](https://github.com/jazzpeh/web-deploy-cli/releases)

## Contribution
<a name="contribution"></a>

### Getting Started
<a name="getting-started"></a>

Install dependencies:
```
yarn install
```

Run examples:
```
yarn start
```

Run unit tests:
```
yarn unit
```

Run integration tests:
```
yarn integration
```

Watch unit tests:
```
yarn test:unit
```

Watch all tests:
```
yarn test
```

## More Information
<a name="more-information"></a>

### Small Print
<a name="small-print"></a>

Author: Jazz Peh &lt;jazzpeh@gmail.com&gt; &copy; 2019

- [@jazzpeh](https://twitter.com/jazzpeh)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/jazzpeh/web-deploy-cli/issues) on Github

## MIT License
<a name="license"></a>

Copyright (c) 2019 Jazz Peh (twitter: [@jazzpeh](https://twitter.com/jazzpeh))
Licensed under the MIT license.

