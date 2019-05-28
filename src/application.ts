// const _ = require('lodash');

// const Module = require('./module');
// const EventMap = require('./event-map');
// const EventDispatcher = require('./event-dispatcher');
// const ErrorDispatcher = require('./error-dispatcher');

// const Event = require('./classes/event');
// const Context = require('./classes/context');

// const defaults = {
//   error: {
//     map: {},
//     default: {
//       name: 'unexpected',
//       severity: 'error'
//     }
//   }
// };

// export class Application {
//   constructor (config) {
//     this._config = _.merge({}, defaults, config);

//     this._eventDispatcher = new EventDispatcher();
//     this._errorDispatcher = new ErrorDispatcher();

//     this._errorMap = {};

//     this._modules = [];

//     this._started = null;
//   }

//   _buildEventMap () {
//     const middlewares = this._buildMiddlewares();
//     this._eventMap = new EventMap(middlewares);

//     this._modules.forEach((mod) => {
//       const handlers = mod.getHandlersOptions();
//       handlers.forEach((handlerOptions) => {
//         this._eventMap.addEventHandler(handlerOptions);
//       });
//     });
//   }

//   _buildErrorMap () {
//     const errorMap = this._modules.reduce((acc, mod) => {
//       return _.merge(acc, mod.getErrorMap());
//     }, {});
//     this._errorMap = _.merge(errorMap, this._errorMap);
//   }

//   _buildErrorHAndlers () {
//     this._errorHandlers = this._modules.reduce((acc, mod) => {
//       const middlewares = mod.getErrorHandlers();
//       return acc.concat(middlewares);
//     }, []);
//   }

//   _buildMiddlewares () {
//     return this._modules.reduce((acc, mod) => {
//       const middlewares = mod.getMiddlewares();
//       middlewares.forEach((middleware) => {
//         if (acc[middleware.constructor.name]) {
//           throw new Error(`Duplicate middleware ${middleware.constructor.name} in module ${mod.constructor.name}.`);
//         }
//         acc[middleware.constructor.name] = middleware;
//       });
//       return acc;
//     }, {});
//   }

//   _build () {
//     if (!this._modules.length) {
//       throw new Error(`Application contains zero modules.`);
//     }

//     this._buildEventMap();
//     this._buildErrorMap();
//     this._buildErrorHAndlers();
//   }

//   _startModules () {
//     return Promise.all(this._modules.map(module => module.start()));
//   }

//   // -- setup

//   addModule (mod) {
//     if (!(Module.isModule(mod))) {
//       throw new Error(`Invalid module ${mod && mod.constructor.name}.`);
//     }
//     if (this._modules.find(item => item.constructor.name === mod.constructor.name)) {
//       throw new Error(`Duplicate module ${mod.constructor.name}.`);
//     }
//     this._modules.push(mod);
//   }

//   addErrorMap (map) {
//     this._errorMap = Object.assign(this._errorMap, map);
//   }

//   // expose resources

//   getServices () {
//     return this._modules.reduce((acc, mod) => {
//       return Object.assign(acc, mod.getServices());
//     }, {});
//   }

//   getModels () {
//     return this._modules.reduce((acc, mod) => {
//       return Object.assign(acc, mod.getModels());
//     }, {});
//   }

//   // -- execute

//   start () {
//     if (this._started) {
//       throw new Error('Application has already been started.');
//     }
//     this._build();
//     return this._startModules()
//       .then(() => {
//         this._started = Date.now();
//       });
//   }

//   newContext (data) {
//     return new Context(data);
//   }

//   newEvent (type, data) {
//     return new Event(type, data);
//   }

// }
