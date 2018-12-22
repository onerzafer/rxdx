import createStore from "../../src/store";
import applyMiddleware from "../../src/applyMiddleware";
import combineReducers from "../../src/combineReducers";
import { devToolsMiddleware } from "../../src/devToolsMiddleware";
import { effectsMiddleware } from "../../src/effectsMiddleware";
import { todoEffects } from "./todo/todo.effects";
import { todoReducer } from "./todo/todo.reducer";

export const Store = createStore(
  combineReducers({
    todos: todoReducer
  }),
  {},
  applyMiddleware(effectsMiddleware(todoEffects), devToolsMiddleware())
);
