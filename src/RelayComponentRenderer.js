import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import React, { PropTypes } from 'react';

import Relay from 'react-relay';

class RelayComponentRenderer extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    renderLoading: PropTypes.func,
    renderError: PropTypes.func,
    navigationState: PropTypes.object.isRequired,
    environment: PropTypes.object,
    getEnvironment: PropTypes.func,
  };

  renderLoading() {
    return (<View>
      <Text>Loading...</Text>
    </View>);
  }

  renderError(error, retry) {
    return (<View style={{padding: 30}}>
      <Text>Error while fetching data from the server</Text>
      <TouchableHighlight onPress={retry}>
        <Text>Retry?</Text>
      </TouchableHighlight>
    </View>);
  }

  render() {
    // TODO: not sure if it is correct to pass all the data, find the way extract only needed variables
    const params = {
      ...this.props.navigationState,
    };

    delete params.environment;

    const {
      Component,
      navigationState,
      environment,
      getEnvironment,
      renderError,
      renderLoading,
    } = this.props;

    return (<Relay.Renderer
      Container={Component}
      queryConfig={{
        queries: navigationState.queries,
        params,
        name: `rnrf_relay_renderer_${navigationState.key}_route`, // construct route name based on navState key
      }}
      environment={navigationState.environment || environment || (getEnvironment && getEnvironment()) || Relay.Store}
      render={({done, error, props, retry, stale}) => {
        if (error) {
          return (renderError || this.renderError)(error, retry);
        }

        if (props) {
          // render component itself
          return <Component {...this.props} {...props} />;
        }

        // render loading
        return (renderLoading || this.renderLoading)(navigationState)
      }}
    />);
  }
}

export default (moduleProps) => (Component) =>
  !Relay.isContainer(Component)
  ?
    Component // not a Relay container, return component itself
  :
    (props) => // relay container - wrap it with renderer
      <RelayComponentRenderer
        {...moduleProps}
        {...props}
        Component={Component}
      />;
