import createStore from '../store';
import createSelector from '../selectors';

describe('createStore', () => {

    const reducer = (state, action) => {
        if (action.type === 'test') {
            return {
                ...state,
                test: true
            };
        }
        return state;
    }

    it('should create a new store', () => {

        const createdStore = createStore(reducer, {});

        expect(createdStore).toBeTruthy();
    });

    it('should accept a set of enhanced/middlewares', () => {
        let middlewareInternal;
        let middlewareCreatedStore;
        const initialState = {};

        const middleware = jest.fn(storeCreator => {
            middlewareInternal = jest.fn((reducer, initSt) => {
                middlewareCreatedStore = storeCreator();
                return middlewareCreatedStore;
            });
            return middlewareInternal;
        })

        const createdStore = createStore(reducer, initialState, middleware);

        expect(createdStore).toBe(middlewareCreatedStore);
        expect(middlewareInternal).toHaveBeenCalledWith(reducer, initialState)

    });

    it('should dispatch an initial acction INIT', () => {
        let middlewareInternal;
        let middlewareCreatedStore;
        const initialState = {};

        const middleware = jest.fn(storeCreator => {
            middlewareInternal = jest.fn((reducer, initSt) => {
                middlewareCreatedStore = storeCreator();

                middlewareCreatedStore.dispatch = jest.fn(middlewareCreatedStore.dispatch);

                return middlewareCreatedStore;
            });
            return middlewareInternal;
        });

        const createdStore = createStore(reducer, initialState, middleware);

        expect(middlewareCreatedStore.dispatch).toHaveBeenCalledWith({ type: '@@store INIT' })

    });

});

describe('store', () => {

    let store;
    let middlewareInternal;
    let middlewareCreatedStore;
    const initialState = { users: [], usersCounter: 0 };
    const reducer = jest.fn((state, action) => {
        if (action.type === 'addUser') {
            return {
                ...state,
                usersCounter: state.usersCounter + 1,
                users: [...state.users, { name: 'User0' + (state.usersCounter + 1) }]
            };
        }
        return state;
    });
    const actionAddUser = { type: 'addUser' };

    beforeEach(() => {

        const middleware = jest.fn(storeCreator => {
            middlewareInternal = jest.fn((reducer, initSt) => {
                middlewareCreatedStore = storeCreator();

                middlewareCreatedStore.dispatch = jest.fn(middlewareCreatedStore.dispatch.bind(middlewareCreatedStore));

                return middlewareCreatedStore;
            });
            return middlewareInternal;
        });

        store = createStore(reducer, initialState, middleware);
    });

    describe('subscribe', () => {

        it('should allow to subscribe to changes', () => {

            // Arrange
            const nextFn = jest.fn();

            store.subscribe(nextFn);

            // Act
            store.dispatch(actionAddUser);

            // Assert
            expect(store).toBe(middlewareCreatedStore);
            // new state from reducer
            expect(nextFn).toHaveBeenCalledWith({
                usersCounter: 1,
                users: [{
                    name: 'User01'
                }]
            });
        });
    });

    describe('getState', () => {

        it('should return the current state', () => {


            expect(store.getState()).toEqual(initialState);

            store.dispatch(actionAddUser);

            expect(store.getState()).toEqual({
                usersCounter: 1,
                users: [{
                    name: 'User01'
                }]
            });
        });

    });

    describe('select', () => {

        it('should pipe to the stream of changes from the store the passed in parameter if it is a function', () => {

            // Arrange
            const nextFn = jest.fn();

            const getFirstUser = createSelector(
                state => state.users,
                users => users[0]
            );

            store.select(getFirstUser).subscribe(nextFn);

            // Act
            store.dispatch(actionAddUser);

            //Assert
            expect(nextFn).toHaveBeenCalledWith({ name: 'User01' });

        });


        it('should return an observalbe with only values specified', () => {

            // Arrange
            const nextFn = jest.fn();

            store.select('usersCounter').subscribe(nextFn);

            // Act
            store.dispatch(actionAddUser);

            //Assert
            expect(nextFn).toHaveBeenCalledWith(1);

        });
    });

    describe('dispatch', () => {

        it('should dispatch an action applying the given reducers', () => {

            // Act
            store.dispatch(actionAddUser);

            // Arrange
            expect(reducer).toHaveBeenCalledWith(initialState, actionAddUser);
        });

    });

});
