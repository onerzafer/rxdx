import {render, cleanup, waitForElement} from 'react-testing-library';
import connect from '../connect';
import createStore  from '../store';
import createSelector from '../selectors';
import React, {Component} from 'react';
import 'jest-dom/extend-expect';

import 'babel-polyfill';

describe('connect', () => {


  const reducer = (state, action) => {
    if (action.type === 'LOGIN') {
      return {
        ...state,
        called: true,
        currentUser: {
          name: 'Öner',
          lastName: 'Zafer',
          isLoggedIn: true
        }
      };
    }

    return state;
  };
  const logInAction = {type: 'LOGIN'};
  const initialState = {
    currentUser: {
      name: 'unknown',
      lastName: '',
      isLoggedIn: false
    }
  };
  const loggedInUserNameSelector = createSelector(
    state => state.currentUser,
    user => user.name
  );

  let store;
  let toProps;

  beforeEach(() => {
    store = createStore(reducer, initialState);
    toProps = {currentUser: store.select(loggedInUserNameSelector)};
  });

  afterEach(() => {
    cleanup();
  });

  // if not action is trigger, it should have the property of the selector with null value (assuming there is not inital state)

  it('should subscribe stateless components to the store changes', async () => {

    const view = jest.fn(({currentUser}) => {
      return (<div data-testid="userName">Hello {currentUser}</div>);
    });

    const ConnectedView = connect(toProps)(view);
    const {getByTestId} = render(<ConnectedView />);

    await waitForElement(() => getByTestId('userName'))

    // first: View rendered
    // second: after subscribed to the store
    expect(view).toHaveBeenCalledTimes(2);
    expect(getByTestId('userName')).toHaveTextContent('Hello unknown');

    store.dispatch(logInAction);

    await waitForElement(() => getByTestId('userName'))

    expect(getByTestId('userName')).toHaveTextContent('Hello Öner');
  });

  it('should subscribe class component to the store changes', async () => {

    let callsCounter = 0;
    let callsArgs = [];

    class View extends Component {
      render() {
        callsCounter++;
        callsArgs.push(this.props.currentUser);

        return (<div data-testid="userName">Hello {this.props.currentUser}</div>);
      }
    }

    const ConnectedView = connect(toProps)(View);
    const {getByTestId} = render(<ConnectedView />);

    expect(callsCounter).toBe(2);
    expect(callsArgs[1]).toEqual(initialState.currentUser.name);


    store.dispatch(logInAction);

    await waitForElement(() => getByTestId('userName'))

    expect(getByTestId('userName')).toHaveTextContent('Hello Öner');
  });

});
