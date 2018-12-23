# RxDx

RxDx is a Rxjs base Redux like state management library and it icludes all necessary tooling inside.

*heaviliy inspired from great libraries [redux](https://github.com/reduxjs/redux), [react-redux](https://github.com/reduxjs/react-redux), [redux-observable](https://github.com/redux-observable/redux-observable) and [ngrx](https://github.com/ngrx/platform)*

## Motivation

Basic idea behind this library  is bringin the full power of RxJS into react world with a familiar interface of Redux withiot relying on some middleware jungle of libraries.

## Installation

```bash
npm install rxdx --save
```
or

```bash
yarn add rxdx
```

## How to Use

### Store
Unlike react-redux RxDx does not rely on context so no need to introduce Provider on App.js. But on the contrary it requires an exported Store to function. In these sample codes it is suggested to have a saperate store.js for initializing the Store and improting it when neccessary. Intentionally the interface of createStore is just like react-redux interface.

```javascript
//store.js
import {
  createStore,
  applyMiddleware,
  combineReducers,
  devToolsMiddleware,
  effectsMiddleware
} from "rxdx/lib/rxdx";
import { todoEffects } from "./todo/todo.effects";
import { todoReducer } from "./todo/todo.reducer";

const initialState = {};

export const Store = createStore(
  combineReducers({
    todos: todoReducer
  }),
  initialState,
  applyMiddleware(
    effectsMiddleware(todoEffects),
    devToolsMiddleware()
  )
);
```

A store instance has following signiture and it can be accessed any time any place it is importat. Yet it is not encouraged to miss use it ;)

```javascript
//store interface example
interface StoreInterface {
    state: Subject<State>;
    select: { (...selectors: string[] | Selector[]): State };
    dispatch: (action: Action) => void;
    subscribe: (next?: (value: State) => void, error?: (error: any) => void, complete?: () => void) => Subscription;
    getState: () => State;
}
```

### Middlewares
There are nearly all neccessary middlewares available like reduxDevTools integration and Effects (for side effects). To insert middlewares there is a special function caled **applyMiddlere** (see above). Besides if you like to create your own middleware you may refer to following example. (**LoggerMiddleware** has the bare minimum middleware signiture)

```javascript
//store.js
import {
  createStore,
  applyMiddleware,
  combineReducers,
  devToolsMiddleware,
  effectsMiddleware
} from "rxdx/lib/rxdx";
import { todoEffects } from "./todo/todo.effects";
import { todoReducer } from "./todo/todo.reducer";

const initialState = {};

const LoggerMiddeleware = (storeGetter) => (next) => (action)=> {
  console.log('LOGGER: ', action);
  return next(action);
}

export const Store = createStore(
  combineReducers({
    todos: todoReducer
  }),
  initialState,
  applyMiddleware(
    effectsMiddleware(todoEffects),
    devToolsMiddleware(),
    LoggerMiddeleware
  )
);
```

### Actions
An action can be any javascript object wich has a type attribute. In the example below object factories used for the sake of example itself. A class or simple object will do the trick.
```javascript
// actions.js
const GET_TODO = 'GET_TODO';

export function getToDoAction() {
    return {
        type: GET_TODO
    }
}
```
Consuming the actions dispatch function of store should be used.
```javascript
import { Store } from 'path/to/store/js/in/your/project';
import { getToDoAction } './actions.js'

Store.dispatch(getToDoAction());
```
### Effects
Effects are basically is the same thing with redux-observable. This small middleware is provided within the library by taking in to consideration that most of the apps has side effects. And to have this functionality without another library dependency will reduce the dependency overhead. Effects requires a helper function/decorator which is **Effect**/**@Effect** (no worries it is also included in te library :)). To combine Store and Effects RxDx provides a middleware called **effectsMiddleware** which need to be passed into **createStore**
```javascript
import * as fromToDoActions from "./todo.actions";
import { mergeMap } from "rxjs/operators";
import { todoService } from "./todo.service";
import { actions$, ofType, Effect } from "rxdx/lib/rxdx";

class ToDoEffects {
  constructor(_toDoService, _actions$) {
    this.onGetToDos = Effect()(
      _actions$
        .pipe(ofType(fromToDoActions.GET_TODOS))
        .pipe(mergeMap(() => _toDoService.getToDos()))
    );

    this.onAddToDo = Effect()(
      _actions$
        .pipe(ofType(fromToDoActions.ADD_TODO))
        .pipe(mergeMap(action => _toDoService.addToDos(action.payload)))
    );

    this.onUpdateToDo = Effect()(
      _actions$
        .pipe(ofType(fromToDoActions.UPDATE_TODO))
        .pipe(mergeMap(action => _toDoService.updateToDos(action.payload)))
    );
  }
}

export const todoEffects = new ToDoEffects(todoService, actions$);
```
if your development environment supports decorators an effect can be used as follows.
```javascript
@Effect()
this.onGetToDos = _actions$
        .pipe(ofType(fromToDoActions.GET_TODOS))
        .pipe(mergeMap(() => _toDoService.getToDos()));
```
Additonally actions$ is an onbservable of action which mean it is possible to use all RxJs tappable functions or anything related with observable streams as long as the stream mapped to an action. Basicly it is up to your creativity ;)
### Selectors
In any react component you will need to subscribe to relevant porion of State so you may do it in two ways. One is using the key of state (can be nested, yeaaay!).
```javascript
/**
 * Assuming the state object in the store as follows
 * {
 *    todos: {
 *      todoList: ['todo1', 'todo2']
 *    }
 * }
 */
import { Store } from 'path/to/store/js/in/your/project';

Store.select('todos', 'todoList')
  .subscribe(list => {
    console.log(list); // ['todo1', 'todo2']
  });
```
Or the second one is using a selector which is created by createSlector function which is more performant thanks to built in momoization. (Incase you have to do complex calculation over state).
```javascript
// todo.selectors.js
import { createSelector } from "rxdx/lib/rxdx";

const combinedStateSelector = state => state.todos;
export const todoListStateSelector = createSelector(
  combinedStateSelector,
  todos => ({...todos.todoList});
);

```
Then the code for selection of a too list can be re written as follows
```javascript
import { Store } from 'path/to/store/js/in/your/project';
import { todoListStateSelector } './todo.selectors';

Store.select(todoListStateSelector)
  .subscribe(list => {
    console.log(list); // ['todo1', 'todo2']
  });
```
### Reducers
Like redux for reducers there is a **combineReducers** function and it can be nested so it is possible to create well structured state objects. As it can be guessed a reducer written for reduc can be used as is in RxDx also.
```javascript
// todo.reducer.js
function todoListReducer(state = [], action) {
  switch (action.type) {
    case fromToDoActions.GET_TODOS:
      return {
        ...state,
        pending: true
      };
    case fromToDoActions.GET_TODOS_OK:
      return {
        ...state,
        pending: false,
        todos: action.payload
      };
    case fromToDoActions.GET_TODOS_ERR:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
}

function todoItemReducer(state = {}, action) {
  switch (action.type) {
    case fromToDoActions.ADD_TODO:
      return {
        ...state,
        pending: true
      };
    case fromToDoActions.ADD_TODO_OK:
      return {
        ...state,
        pending: false,
        todo: action.payload
      };
    case fromToDoActions.ADD_TODO_ERR:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
}

export const todoReducer = combineReducers({
  todoList: todoListReducer,
  todoItem: todoItemReducer
});

//store.js
import {
  createStore,
  combineReducers
} from "rxdx/lib/rxdx";
import { todoReducer } from "./todo.reducer";

const initialState = {};

export const Store = createStore(
  combineReducers({
    todos: todoReducer
  }),
  initialState
);

```
### Connect to React Components
So far there were no connection to a react component and can be used independent from react. But what's the point if we are not using it in react? Since react has its own rendering mechanism and internal states etc. there is a need for a connecter smart enough stich the RxDx into react lifecycle and this is called **connect**
```javascript
import React from 'react';
import { connect } from 'rxdx/lib/rxdx';
import { Store } from 'path/to/store/js/in/your/project';
import { ToDoItem } from './todo-list-item';
import { filteredTodoListSelector } from './todo.selectors';

export const ToDoPage = ({todos}) => {
    return (
        <div className="todo-page">
            {
                todos ? todos.map(todo => <ToDoItem key={todo.id} todo={todo}></ToDoItem>) : undefined
            }
        </div>
    )
}

const toProps = {todos: Store.select(filteredTodoListSelector)};
export const ToDoEnhanced = connect(toProps)(ToDoPage);
```
If your environment allows you to use decorators it is possible to use connect as a decorator
```javascript
const toProps = {todos: Store.select(filteredTodoListSelector)};

@connect(toProps)
export class ToDoPage extentds Component {

 render() {
   const {todos} = this.props;
    return (
        <div className="todo-page">
            {
                todos ? todos.map(todo => <ToDoItem key={todo.id} todo={todo}></ToDoItem>) : undefined
            }
        </div>
    )
 }
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)