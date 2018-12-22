import React from 'react';
import { Store } from '../../stores/store';
import { updateToDoAction } from '../../stores/todo/todo.actions';
import './todo-list-item.css'

export const ToDoItem = ({todo}) => {
    function handleDone() {
        Store.dispatch(updateToDoAction({
            ...todo,
            isDone: !todo.isDone
        }));
    }
    return <div className="list-item">
        <input type="checkbox" defaultChecked={todo.isDone} onChange={handleDone}/>
        <span className={todo.isDone ? 'done': 'undone'}>{todo.task}</span>
    </div>
}