/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';

import {
  Header,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ButteredToastProvider, { withButter } from './components/ButteredToastProvider';

const RedBread = ({ consumeToast, ...extraProps }) => {
  return (
    <TouchableOpacity
      {...extraProps}
      onPress={consumeToast}
      style={{
        width: 200,
        height: 100,
        backgroundColor: 'red',
      }}
    />
  );
};

const GreenBread = ({ consumeToast, ...extraProps }) => (
  <TouchableOpacity
    {...extraProps}
    onPress={consumeToast}
    style={{
      width: 100,
      height: 200,
      backgroundColor: 'green',
    }}
  />
);

const AutoConsumingBread = ({ animLifespan, ...extraProps }) => (
  <Animated.View
    {...extraProps}
    style={{
      opacity: Animated.subtract(
        1,
        animLifespan,
      ),
      width: 200,
      height: 300,
      backgroundColor: 'orange',
    }}
  />
);

class App extends React.Component {
  componentDidMount() {
    const {
      makeToast,
      consumeToast,
    } = this.props;
    makeToast(
      RedBread,
    )
      .then(() => makeToast(
        AutoConsumingBread,
        {
          lifespan: 3000,
        },
      ))
      .then(() => makeToast(
        GreenBread,
      ));
  }
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default ({ ...extraProps }) => {
  const ButteryApp = withButter(
    App,
  );
  return (
    <ButteredToastProvider
    >
      <ButteryApp
        {...extraProps}
      />
    </ButteredToastProvider>
  );
};
