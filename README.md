# Monkfish

> Node.js application framework inspired by DDD, Hexagonal and Clean principles.


## Getting Started

```shell
npm install --save @cork-labs/moknfish
```



## API


### class Application

#### constructor(eventHandler, errorHandler, logger)

#### newEvent(data)

#### newContext(type, data)

#### handle(event, context, logger)


### class ErrorHandler

#### constructor(fns, config)

#### handle(err, event, context, logger)


### class EventHandler

#### constructor(controllers, preFns, postFns)

#### handle(event, context, logger)

#### constructor(fns, config)


### class Context

#### constructor(data)


### class Event

#### constructor(type, data)


### class Result

#### constructor(data, meta)


### class ApplicationError extends Error

#### constructor (name, severity, details, parent)


## Develop

```shell
# lint and fix
npm run lint

# run test suite
npm test

# lint and test
npm run build

# serve test coverage
npm run coverage

# publish a minor version
node_modules/.bin/npm-bump minor
```


### Contributing

We'd love for you to contribute to our source code and to make it even better than it is today!

Check [CONTRIBUTING](https://github.com/cork-labs/contributing/blob/master/CONTRIBUTING.md) before submitting issues and PRs.


## Links

- [npm-bump](https://www.npmjs.com/package/npm-bump)
- [chai](http://chaijs.com/api/)
- [chai-as-promised](http://chaijs.com/plugins/chai-as-promised/)
- [sinon](http://sinonjs.org/)
- [sinon-chai](https://github.com/domenic/sinon-chai)


## [MIT License](LICENSE)

[Copyright (c) 2018 Cork Labs](http://cork-labs.mit-license.org/2018)
