import applyMiddleware from '../applyMiddleware';

describe('applyMiddleware', () => {

    const action = {type:'testAction'};

    let storeDispatchOriginalFn;
    let expectedStore = {};
    let storeCreatorMock;

    let middlewareOneExecutorMock ;
    let middlewareOneNextWrapperMock;
    let middlewareOneMock;

    let middlewareTwoExecutorMock ;
    let middlewareTwoNextWrapperMock;
    let middlewareTwoMock;

    beforeEach(() => {
        // Restore the original store dispatch method
        storeDispatchOriginalFn = jest.fn(()  => ({originalDispatch:true}));
        expectedStore = {dispatch: storeDispatchOriginalFn, isStore: true};

        middlewareOneNextWrapperMock = jest.fn(ntx => {
            middlewareOneExecutorMock = jest.fn(a => {
                ntx(a);
                return "voidOne";
            });
            return middlewareOneExecutorMock;
        });
        middlewareOneMock = jest.fn(s => middlewareOneNextWrapperMock);


        middlewareTwoNextWrapperMock = jest.fn(ntx => {
            middlewareTwoExecutorMock = jest.fn(a => {
                ntx(a);
            });
            return middlewareTwoExecutorMock;
        });
        middlewareTwoMock = jest.fn(s => middlewareTwoNextWrapperMock);

        storeCreatorMock = jest.fn(_ => expectedStore);
    });

    afterEach(() => {
        middlewareOneExecutorMock = null;
        middlewareOneNextWrapperMock = null;
        middlewareOneMock = null;

        middlewareTwoExecutorMock = null;
        middlewareTwoNextWrapperMock = null;
        middlewareTwoMock = null;
    });

    it('should return a function', () => {
        // Assert
        expect(applyMiddleware([])).toBeTruthy();
        expect(applyMiddleware([])).toBeInstanceOf(Function);
    });

    it('should have the signature: ([...middlewares]) => (storeCreator) => (...storeCreationArgs) => store', () => {

        // Act
        const initializerFn = applyMiddleware(middlewareOneMock);
        const storeCreationFn = initializerFn(storeCreatorMock);
        const storeObj = storeCreationFn(42, true);

        // Assert
        expect(storeCreatorMock).toHaveBeenCalledWith(42, true);
        expect(storeObj).toBe(expectedStore);
    });

    it('should initialize and concatenate all middlewares', () => {
        // Act
        const initializerFn = applyMiddleware(middlewareOneMock, middlewareTwoMock);
        const storeCreationFn = initializerFn(storeCreatorMock);
        const storeObj = storeCreationFn(42, true);

        storeObj.dispatch(action);

        // Assert
        expect(storeCreatorMock).toHaveBeenCalledWith(42, true);
        expect(storeObj).toBe(expectedStore);

        expect(middlewareOneMock).toHaveBeenCalledWith(expectedStore);
        expect(middlewareTwoMock).toHaveBeenCalledWith(expectedStore);

        expect(middlewareOneExecutorMock).toHaveBeenCalledWith(action);
        expect(middlewareTwoExecutorMock).toHaveBeenCalledWith(action);
    });

    it('should pass as "next" the original store.dispatch to the first middleware', () => {

        // Act
        const initializerFn = applyMiddleware(middlewareOneMock);
        const storeCreationFn = initializerFn(storeCreatorMock);
        const storeObj = storeCreationFn(42, true);

        // Assert
        expect(storeObj).toBe(expectedStore);
        expect(middlewareOneNextWrapperMock.mock.calls[0][0]()).toEqual(storeDispatchOriginalFn());
    });

    it('should override the original store.dispatch method by the concatenation of all middlewares result', () => {

        // Act
        const initializerFn = applyMiddleware(middlewareOneMock, middlewareTwoMock);
        const storeCreationFn = initializerFn(storeCreatorMock);
        const storeObj = storeCreationFn(42, true);

        // Assert
        expect(storeObj.dispatch).not.toBe(storeDispatchOriginalFn);
        expect(storeDispatchOriginalFn).not.toHaveBeenCalled();

        storeObj.dispatch(action);

        expect(storeDispatchOriginalFn).toHaveBeenCalledWith(action);
        expect(middlewareOneExecutorMock).toHaveBeenCalledWith(action);
        expect(middlewareTwoExecutorMock).toHaveBeenCalledWith(action);

    });
});
