import React from 'react';
import { ToDoHeader } from "../components/todo-header/todo-header";
import { Store } from '../stores/store';
import { connect } from '../store/connect';
import { ToDoItem } from '../components/todo-list-item/todo-list-item';
import { filteredTodoListSelector } from '../stores/todo/todo.selectors';

export const ToDoPage = ({todos}) => {
    return (
        <div className="todo-page">
            <ToDoHeader />
            {
                todos ? todos.map(todo => <ToDoItem key={todo.id} todo={todo}></ToDoItem>) : undefined
            }
        </div>
    )
}

const toProps = {todos: Store.select(filteredTodoListSelector)};
export const ToDoEnhanced = connect(toProps)(ToDoPage);