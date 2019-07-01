[![Build Status](https://travis-ci.org/jazzpeh/web-deploy-cli.svg?branch=master)](https://travis-ci.org/jazzpeh/web-deploy-cli)

# Web Deploy CLI

This package makes it easy to deploy static web applications. It does this by exposing a small set of easy-to-use CLI commands and arguments to quickly  deploy your entire project. 

Currently it supports the following cloud deployment service:
* AWS S3 Static Website Hosting

## Contents

1. [Dependencies](#dependencies)
   * [node](#node)
2. [Installation](#installation)
3. [CLI Commands](#cli-commands)
    * [Deploy to AWS S3](#deploy-to-aws)
3. [Small Print](#small-print)
4. [MIT License](#mit-license)

## Dependencies

### Node

This package requires **Node >= 8.0**.

You can install [Node.js](http://www.nodejs.org/) via the package provided on [their site](http://www.nodejs.org).
Installing node will also install the [Node Package Manager](https://github.com/npm/npm) (NPM) to download and
install node modules.

## Installation

Installing Build Tools as a global module will give you command-line access to all tasks available.

You can install globally by typing the following in your terminal:

```
npm install web-deploy-cli  -g
```

## Deploy to AWS S3

You can use this command to deploy your static web application to AWS S3 bucket:

```
web-deploy --bucket=<your_bucket_name> --profile=<your_aws_credential_profile_name> --dir=<absolute_path_to_your_project_directory> --folder=<>
```

## Small Print

Author: Jazz Peh &lt;jazzpeh@gmail.com&gt; &copy; 2019

- [@jazzpeh](https://twitter.com/jazzpeh)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/jazzpeh/web-deploy-cli/issues) on Github

## MIT License

Copyright (c) 2019 Jazz Peh &lt;jazzpeh@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.