import { BehaviorSubject } from "rxjs";
import { pluck, map } from "rxjs/operators";

class Store {
  state = new BehaviorSubject({});
  reducer;

  constructor(reducer, initialState) {
    this.state.next(initialState);
    this.reducer = reducer;
  }

  dispatch(action) {
    this.state.next(this.reducer(this.getState(), action));
  }

  select(...selectors) {
    if(selectors && selectors.length === 1 && typeof selectors[0] === 'function') {
      return this.state.pipe(map(selectors[0]))
    } else {
      return this.state.pipe(pluck(...selectors));
    }
  }

  getState() {
    return this.state.value;
  }

  subscribe() {
    return this.state.subscribe;
  }
}


function createStore(reducer, initialState, enhancer) {
  let store = new Store(reducer, initialState);
  store = enhancer ? enhancer(() => store)(reducer, initialState) :  new Store(reducer, initialState);
  store.dispatch({type: '@@store INIT'});
  return store;
}

export default createStore;
