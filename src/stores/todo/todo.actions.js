export const GET_TODOS = 'GET_TODOS';
export const GET_TODOS_OK = 'GET_TODOS_OK';
export const GET_TODOS_ERR = 'GET_TODOS_ERR';
export const FILTER_TODOS = 'FILTER_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const ADD_TODO_OK = 'ADD_TODO_OK';
export const ADD_TODO_ERR = 'ADD_TODO_ERR';
export const UPDATE_TODO = 'UPDATE_TODO';
export const UPDATE_TODO_OK = 'UPDATE_TODO_OK';
export const UPDATE_TODO_ERR = 'UPDATE_TODO_ERR';
export const DELETE_TODO = 'DELETE_TODO';
export const DELETE_TODO_OK = 'DELETE_TODO_OK';
export const DELETE_TODO_ERR = 'DELETE_TODO_ERR';

export function getToDosAction() {
    return {
        type: GET_TODOS
    }
}

export function getToDosOkAction(todos) {
    return {
        type: GET_TODOS_OK,
        payload: todos
    }
}

export function getToDosErrAction(err) {
    return {
        type: GET_TODOS_ERR,
        payload: err
    }
}

export function filterTodosAction(filter) {
    return {
        type: FILTER_TODOS,
        payload: filter
    }
}

export function addToDoAction(todo) {
    return {
        type: ADD_TODO,
        payload: todo
    }
}

export function addToDoOkAction(todo) {
    return {
        type: ADD_TODO_OK,
        payload: todo
    }
}

export function addToDoErrAction(err) {
    return {
        type: ADD_TODO_ERR,
        payload: err
    }
}

export function updateToDoAction(todo) {
    return {
        type: UPDATE_TODO,
        payload: todo
    }
}

export function updateToDoOkAction(todo) {
    return {
        type: UPDATE_TODO_OK,
        payload: todo
    }
}

export function updateToDoErrAction(err) {
    return {
        type: UPDATE_TODO_ERR,
        payload: err
    }
}

export function deleteToDoAction(id) {
    return {
        type: DELETE_TODO,
        payload: id
    }
}

export function deleteToDoOkAction() {
    return {
        type: DELETE_TODO_OK
    }
}

export function deleteToDoErrAction(err) {
    return {
        type: DELETE_TODO_ERR,
        payload: err
    }
}