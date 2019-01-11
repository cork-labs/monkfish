'use strict';

class EventDispatcher {
  _preDispatch (event, context, logger, pipeline) {
    if (!pipeline.length) {
      return Promise.resolve();
    }
    const middleware = pipeline.shift();
    return Promise.resolve()
      .then(() => middleware.handle(event, context, logger))
      .then(() => this._preDispatch(event, context, logger, pipeline));
  }

  _postDispatch (event, result, context, logger, pipeline) {
    if (!pipeline.length) {
      return Promise.resolve(result);
    }
    const middleware = pipeline.shift();
    return Promise.resolve()
      .then(() => middleware.handle(result, event, context, logger))
      .catch((err) => logger.error('monkfish.application.post-dispatch', { middleware: middleware.name }, err))
      .then(() => this._postDispatch(event, result, context, logger, pipeline));
  }

  // -- public

  dispatch (handler, event, context, logger) {
    return new Promise((resolve, reject) => {
      return this._preDispatch(event, context, logger, handler.pre.slice(0))
        .then(() => handler.controller.handle(event, context, logger))
        .then((result) => this._postDispatch(event, result, context, logger, handler.post.slice(0)))
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = EventDispatcher;
