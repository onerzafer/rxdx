import createStore from "../store/store";
import applyMiddleware from "../store/applyMiddleware";
import combineReducers from "../store/combineReducers";
import { devToolsMiddleware } from "../store/devToolsMiddleware";
import { effectsMiddleware } from "../store/effectsMiddleware";
import { todoEffects } from "./todo/todo.effects";
import { todoReducer } from "./todo/todo.reducer";

export const Store = createStore(
  combineReducers({
    todos: todoReducer
  }),
  {},
  applyMiddleware(effectsMiddleware(todoEffects), devToolsMiddleware())
);
