import { BehaviorSubject } from "rxjs";
import { pluck, map } from "rxjs/operators";

class Store {
  state = new BehaviorSubject({});
  reducer;

  constructor(reducer, initialState) {
    this.state.next(initialState);
    this.reducer = reducer;
  }

  /**
   * Dispatch the given action to alter the current state
   * @param action Action object to be proceesed by the reducers
   */
  dispatch(action) {
    this.state.next(this.reducer(this.getState(), action));
  }

  /**
   * Creates a new observable that will be calles on every state change filtered with the given selector
   * @param ...object | function One function to map the current state obserbable or a list of object to pluck into the state observable
   */
  select(...selectors) {
    if(selectors && selectors.length === 1 && typeof selectors[0] === 'function') {
      return this.state.pipe(map(selectors[0]));
    } else {
      return this.state.pipe(pluck(...selectors));
    }
  }

  /**
   * Returns the current state of the store
   */
  getState() {
    return this.state.value;
  }

  /**
   * Subscribe to changes in the store
   * @param subcriber Function to be called on each new value or object with next, error and complete functions.
   * @example:
   * {
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    }
   */
  subscribe(subcriber) {
    return this.state.subscribe(subcriber);
  }
}


function createStore(reducer, initialState, enhancer) {
  let store = new Store(reducer, initialState);
  store = enhancer ? enhancer(() => store)(reducer, initialState) :  store;
  store.dispatch({type: '@@store INIT'});
  return store;
}

export default createStore;
