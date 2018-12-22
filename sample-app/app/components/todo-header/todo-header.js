import React from "react";
import { connect } from "../../../src/connect";
import { Store } from "../../stores/store";
import * as fromToDoStore from "../../stores/todo/todo.actions";
import { todoListFilterSelector } from "../../stores/todo/todo.selectors";

export const ToDoHeaderComp = ({filter}) => {
  let val = undefined;
  function addToDo() {
    if (val && val !== "") {
      Store.dispatch(fromToDoStore.addToDoAction(val));
    }
  }
  function setVal(e) {
    const { target } = e;
    val = target.value;
  }
  function handleFilter(e) {
      Store.dispatch(fromToDoStore.filterTodosAction(e.target.value));
  }
  return (
    <div className="todo-header-container">
      <div className="input-container">
        <input name="todo-input" type="text" onChange={setVal} />
        <button onClick={addToDo}>Add</button>
      </div>
      <div className="tab-container">
          <button type="button" disabled={filter === 'all'} onClick={handleFilter} value="all">All</button>
          <button type="button" disabled={filter === 'completed'} onClick={handleFilter} value="completed">Completed</button>
          <button type="button" disabled={filter === 'uncompleted'} onClick={handleFilter} value="uncompleted">Uncompleted</button>
      </div>
    </div>
  );
};

export const ToDoHeader = connect({
  filter: Store.select(todoListFilterSelector)
})(ToDoHeaderComp);
