import React from "react";

const connect = propsToSubscribe => WrappedComponent => {
  return class ConnectedComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.subscriptions = {};
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
