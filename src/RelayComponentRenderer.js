import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Relay from 'react-relay/classic';

class RelayComponentRenderer extends Component {
  static propTypes = {
    component: PropTypes.func,
    renderLoading: PropTypes.func,
    renderError: PropTypes.func,
    navigationState: PropTypes.object,
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

    return (<Relay.Renderer
      Container={this.props.component}
      queryConfig={{
        queries: this.props.navigationState.queries,
        params,
        name: `rnrf_relay_renderer_${this.props.navigationState.key}_route`, // construct route name based on navState key
      }}
      environment={this.props.navigationState.environment || this.props.environment || Relay.Store}
      render={({done, error, props, retry, stale}) => {
        if (error) {
          return (this.props.renderError || this.renderError)(error, retry);
        }

        if (props) {
          // render component itself
          return <this.props.component {...this.props} {...props} />;
        }

        // render loading
        return (this.props.renderLoading || this.renderLoading)(this.props.navigationState)
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
        component={Component}
      />;
