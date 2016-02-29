simple-producer-consumer
========================

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Code Climate](https://codeclimate.com/github/cflynn07/simple-producer-consumer/badges/gpa.svg)](https://codeclimate.com/github/cflynn07/simple-producer-consumer)
[![codecov.io](https://codecov.io/github/cflynn07/simple-producer-consumer/coverage.svg?branch=master)](https://codecov.io/github/cflynn07/simple-producer-consumer?branch=master)
[![Dependency Status](https://david-dm.org/cflynn07/simple-producer-consumer.svg)](https://david-dm.org/cflynn07/simple-producer-consumer)
[![devDependency Status](https://david-dm.org/cflynn07/simple-producer-consumer/dev-status.svg)](https://david-dm.org/cflynn07/simple-producer-consumer#info=devDependencies)

Jenkins  
[![Build Status (Jenkins)](http://52.36.217.21/buildStatus/icon?job=simple-producer-consumer)](http://52.36.217.21/job/simple-producer-consumer/)  
Travis CI  
[![Build Status (Travis CI)](https://travis-ci.org/cflynn07/simple-producer-consumer.svg)](https://travis-ci.org/cflynn07/simple-producer-consumer)

[![NPM](https://nodei.co/npm/simple-producer-consumer.png?compact=true)](https://nodei.co/npm/simple-producer-consumer/)

A project to demonstrate bi-directional asynchronous network communication between independent
Node.js processes.

A `generator` process creates random arithmetic expressions of 1 to 3 operations (2 to 4 operands)
and sends the JSON formatted representation of the expression to an `evaluator` process which
computes the value and replies to the `generator`. The generator and the evaluator communicate via
websockets (facilitated by the Socket.io library).

Demonstration
-------------
[![asciicast](https://asciinema.org/a/3dmqbxi0n8t0fk8gfab0bw99k.png)](https://asciinema.org/a/3dmqbxi0n8t0fk8gfab0bw99k)

Requirements
------------
 - Node.js (minimum v4.0.0) or Docker

Usage
-----
#### Option 1 - Run generator and evaluator processes locally on same machine
```bash
# Install the npm module globally (may need to run as root via sudo)
$ npm install simple-producer-consumer@latest -g
# Start the evaluator process
$ spc-evaluator
# Start the generator process (in a different terminal window)
$ spc-generator
```

#### Option 2 - Run the generator and connect to a hosted evaluator process running on an AWS EC2 server
```bash
# NOTE: I have stopping paying for this EC2 instance.
# Install the npm module globally (may need to run as root via sudo)
$ npm install simple-producer-consumer@latest -g
# Start the generator process (in a different terminal window)
$ SPC_SERVER_HOST=ec2-52-35-48-3.us-west-2.compute.amazonaws.com spc-generator
```

#### Option 3 - Clone the repo, build the module and run without installing globally on your system
```bash
$ git clone git@github.com:cflynn07/simple-producer-consumer.git
$ cd ./simple-producer-consumer
$ npm install .
# Start the evaluator
$ npm run evaluator
# Start the generator
$ npm run generator
```

#### Option 4 - Docker
(Image is built by Jenkins after successful test run)
```bash
$ docker pull cflynnus/simple-producer-consumer
$ docker run --name evaluator cflynnus/simple-producer-consumer npm run evaluator
$ docker run --link evaluator:evaluator --name generator -e SPC_SERVER_HOST=evaluator cflynnus/simple-producer-consumer npm run generator # in separate terminal
```

Tests
-----
Unit tests use Mocha, Unit.js and Istanbul
```bash
# Run tests on host OS
$ npm run test
$ npm run test-html-cov # Will auto-open Google Chrome with test coverage data on OSX
# Run tests in docker container (recommended)
# Docker must be install & running
$ npm run test-docker # runs tests in container based on image: node:5.7.0
```

Configuration
-------------
Configuration options can be overriden by enviroment variables. Default values are defined in
`configs/.env`
```bash
SPC_EXPRESSION_DISPLAY_COUNT=10
SPC_GENERATOR_INTERVAL=250
SPC_LOG_LEVEL_STDOUT=none
SPC_SERVER_HOST=localhost
SPC_SERVER_PORT=3001
```

UML Diagrams
------------
#### Sequence
![UML_Sequence](https://raw.githubusercontent.com/cflynn07/simple-producer-consumer/master/UML_Sequence.png)

License
-------
MIT
