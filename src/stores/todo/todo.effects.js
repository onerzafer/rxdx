import * as fromToDoActions from "./todo.actions";
import { mergeMap } from "rxjs/operators";
import { todoService } from "./todo.service";
import { actions$, ofType, Effect } from "../../store/effectsMiddleware";

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
