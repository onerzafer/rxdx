export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    let store = createStore(...args);
    store.dispatch = middlewares
      .map(middleware => middleware(store))
      .reduce((a, b) => (...args) => a(b(...args)))(store.dispatch.bind(store))
    return store;
  };
}
