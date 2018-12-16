import { BehaviorSubject } from "rxjs";
import { pluck, map } from "rxjs/operators";

function Store(reducer, initialState) {
  const state = new BehaviorSubject(initialState);

  function dispatch(action) {
    this.state.next(reducer(this.getState(), action));
  }

  function select(...selectors) {
    if(selectors && selectors.length === 1 && typeof selectors[0] === 'function') {
      return this.state.pipe(map(selectors[0]))
    } else {
      return this.state.pipe(pluck(...selectors));
    }
  }

  function getState() {
    return this.state.value;
  }

  function subscribe() {
    return this.state.subscribe;
  }

  return {
    state,
    select,
    dispatch,
    subscribe,
    getState,
    $$observable: state
  }
}


function createStore(reducer, initialState, enhancer) {
  let store = new Store(reducer, initialState);
  store = enhancer ? enhancer(() => store)(reducer, initialState) :  new Store(reducer, initialState);
  store.dispatch({type: '@@store INIT'});
  return store;
}

export default createStore;
