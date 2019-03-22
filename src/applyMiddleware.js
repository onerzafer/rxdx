/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * Note that each middleware will be given the `dispatch` function and `store` object
 * as arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    let store = createStore(...args);
    store.dispatch = middlewares
      .map(middleware => middleware(store))
      .reduce((a, b) => (...args) => a(b(...args)))(store.dispatch.bind(store))
    return store;
  };
}
