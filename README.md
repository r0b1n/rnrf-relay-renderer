## This library still under development. Use it at your own risk!

# rnrf-relay-renderer
Relay renderer adopted to work with [react-native-router-flux](https://github.com/aksonov/react-native-router-flux) library.

## To Be Done
- [x] Move Relay renderer from example in ths repo as module.
- [ ] Add tests
- [ ] Rewrite example to use this module
- [x] Release it on npm.

# How to use it
First of all, install it with `npm`:
```
npm install rnrf-relay-renderer --save
```

Then you will be able to pass it to the `react-native-router-flux` scene definition.
```jsx
// importing Renderer from library
import RelayRenderer from 'rnrf-relay-renderer'

// then we include it to `wrapBy` option. Note function calling
// we can per-configure Renderer here. See API section.
<Router createReducer={reducerCreate} wrapBy={RelayRenderer()}>
  <Scene key="root">
    <Scene
      key="Countries"
      component={CountriesListScreen}
      queries={{viewer: () => Relay.QL`query { viewer } `,}}
    />
          
    <Scene
      key="Country"
      component={CountryInfoScreen}
      queries={{viewer: () => Relay.QL`query { viewer } `,}}
    />
    
    <Scene
      key="City"
      component={CityInfoScreen}
      queries={{viewer: () => Relay.QL`query { viewer } `,}}
    />
  </Scene>
</Router>
```

# API
to be done
