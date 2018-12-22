import { of } from "rxjs";
import { map } from "rxjs/operators";
import * as fromToDoActions from "./todo.actions";
import { readLocal, writeLocal } from "../../utils/local-storage-manager";

class ToDoService {
  getToDos() {
    return of(readLocal("todo_db", []))
      .pipe(map(todos => fromToDoActions.getToDosOkAction(todos)));
  }

  addToDos(todoText) {
    const todos = readLocal("todo_db", []);
    const todoItem = {
      id: new Date().getTime(),
      isDone: false,
      task: todoText
    };
    todos.push(todoItem);
    writeLocal("todo_db", todos);

    return of(todoItem)
      .pipe(map(todo => fromToDoActions.addToDoOkAction(todoItem)));
  }

  updateToDos(todo) {
    const todos = readLocal("todo_db", []);
    const todoItemIndex = todos.findIndex(t => t.id === todo.id);
    if (todoItemIndex > -1) {
      todos[todoItemIndex] = {
        ...todos[todoItemIndex],
        ...todo
      }
    }
    writeLocal("todo_db", todos);

    return of(todos[todoItemIndex])
      .pipe(map(todoUpdated => fromToDoActions.updateToDoOkAction(todoUpdated)));
  }
}

export const todoService = new ToDoService();
