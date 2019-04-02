import combineReducers from '../combineReducers';

describe('combineReducers', () => {

    it('should generate a unified reducer', () => {

        // Arrange
        const combinedReducer = combineReducers({
            todos: function (state, action) {
                return {
                    ...state,
                    todosCalled: true
                };
            },
            users: function (state, action) {
                return {
                    ...state,
                    usersCalled: true
                };
            }
        });
        const state = {initialState: true};

        // Act
        const newState = combinedReducer(state, {type: 'callAll'});

        // Assert
        expect(newState.users.usersCalled).toBe(true);
        expect(newState.todos.todosCalled).toBe(true);
    });

    it('should create a new reducer that preserve the current state', () => {

        // Arrange
        const combinedReducer = combineReducers({
            todos: function (state, action) {
                return {
                    ...state,
                    todosCalled: true
                };
            },
        });
        const state = {initialState: true};

        // Act
        const newState = combinedReducer(state, {type: 'callAll'});

        // Assert
        expect(newState.initialState).toBe(true)
    });

    it('should assume empty object when falsy state is passed-in', () => {

        // Arrange
        const combinedReducer = combineReducers({
            todos: function (state, action) {
                return {
                    ...state,
                    todosCalled: true
                };
            },
        });
        const state = undefined;

        // Act
        const newState = combinedReducer(state, {type: 'callAll'});

        // Assert
        expect(newState.todos.todosCalled).toBe(true);
    });

    it('should accept that a reducer return falsy', () => {

        // Arrange
        const combinedReducer = combineReducers({
            todos: function (state, action) {
                return false;
            },
        });
        const state = {todos: {present: true}};

        // Act
        const newState = combinedReducer(state, {type: 'callAll'});

        // Assert
        expect(newState.todos).toBeUndefined();
    });
});