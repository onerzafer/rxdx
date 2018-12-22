import { initialToDoState, initialToDoListState } from "./todo.data";
import * as fromToDoActions from "./todo.actions";
import combineReducers from "../../../src/combineReducers";

function todoListReducer(state = initialToDoListState, action) {
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
    case fromToDoActions.FILTER_TODOS:
      return {
        ...state,
        filter: action.payload
      };
    case fromToDoActions.ADD_TODO_OK: {
      return {
        ...state,
        pending: false,
        todos: [...state.todos, action.payload]
      };
    }
    case fromToDoActions.UPDATE_TODO: {
      const todos = [...state.todos];
      const index = todos.findIndex(t => t.id === action.payload.id);
      if (index > -1) {
        todos[index] = {
          ...todos[index],
          ...action.payload
        };
      }
      return {
        ...state,
        todos: todos
      };
    }
    default:
      return state;
  }
}

function todoItemReducer(state = initialToDoState, action) {
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