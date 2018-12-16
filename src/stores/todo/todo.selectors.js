import { createSelector } from "../../store/selectors";

const combinedStateSelector = state => state.todos;
export const todoListStateSelector = createSelector(
  combinedStateSelector,
  todos => ({...todos.todoList})
);

export const todoListFilterSelector = createSelector(todoListStateSelector, todoList => todoList.filter);

export const filteredTodoListSelector = createSelector(
  todoListStateSelector,
  todoList => todoList.todos.filter(todo => {
      switch (todoList.filter) {
        case "all":
          return true;
        case "completed":
          return todo.isDone;
        case "uncompleted":
          return !todo.isDone;
        default:
          return true;
      }
    })
);

export const todoListPendingSelector = createSelector(
  todoListStateSelector,
  todoList => todoList.pending
);

export const todoItemPendingSelector = createSelector(
  combinedStateSelector,
  todos => todos.todoItem.pending
);
