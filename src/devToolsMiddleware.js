const devToolsMiddleware = config => {
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(config);
  return storeGetter => {
    const store = storeGetter();
    devTools.subscribe(message => {
      switch (message.type) {
        case "ACTION": {
          const action = JSON.parse(message.payload);
          store.dispatch(action);
          devTools.send(action, store.getState());
          break;
        }
        case "DISPATCH": {
          const state = JSON.parse(message.state);
          store.state.next(state);
          break;
        }
        default:
          //console.log(message);
      }
    });
    return next => action => {
      const result = next(action);
      devTools.send(action, store.getState());
      return result;
    };
  };
};

export default devToolsMiddleware;
