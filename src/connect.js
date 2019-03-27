import React from "react";

/**
 * Function that create a HoC that will connect the inner (passed-in) component the the rxdx store.
 * Exeucting a re-render when subscriptions (selction from the store) specified by propsToSubscribe
 * generate a state change in the HoC component.
 *
 * @param propsToSubscribe Object where each porperty is a RxJs subject responsible for selector
 * the piece of state from the store that the current component is responsible for handling
 *
 * @param WrappedComponent React inner component to be connected to the store
 */
const connect = propsToSubscribe => WrappedComponent => {
  return class ConnectedComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.subscriptions = {};
      // load initial state
      this.state = Object.keys(propsToSubscribe).reduce((cum, curr) => {
        return {
          ...cum,
          [curr]: undefined
        };
      }, {});

    }

    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method();
    }

    componentDidMount() {
      // subscribe
      this.subscriptions = Object.keys(propsToSubscribe).reduce((cum, curr) => {
        return {
          ...cum,
          [curr]: propsToSubscribe[curr].subscribe(result => {
            this.setState({ [curr]: result });
          })
        };
      }, {});
    }

    componentWillUnmount() {
      // unsubscribe
      Object.keys(this.subscriptions).forEach(key => {
        this.subscriptions[key].unsubscribe();
      });
    }

    render() {
      const overriddenProps = {
        ...this.props,
        observables: {
          ...propsToSubscribe
        },
        ...this.state
      };
      if (typeof WrappedComponent !== "function") {
        overriddenProps.ref = this.proc.bind(this);
      }

      return React.createElement(WrappedComponent, {...overriddenProps}, null);
    }
  };
};

export default connect;
