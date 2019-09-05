/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
  Animated,
  Image,
  TextInput,
} from 'react-native';

import {
  Header,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ButteredToastProvider, { withButter } from './components/ButteredToastProvider';

const NotificationBread = ({ title, description, image, consumeToast, ...extraProps }) => (
  <View
    {...extraProps}
    style={{
      borderRadius: 5,
      backgroundColor: 'white',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'lightgrey',
      maxWidth: 300,
      flex: 2,
    }}
  >
    <Text
      style={{
        fontSize: 20,
        margin: 5,
      }}
      children={title}
    />
    {(!!image) && (
      <Image
        source={{
          uri: image,
        }}
        style={{
          width: 300,
          height: 150,
        }}
      />
    )}
    <Text
      style={{
        fontSize: 16,
        margin: 5,
      }}
      children={description}
    />
  </View>
);

const InputToast = ({ consumeToast, ...extraProps }) => (
  <View
    {...extraProps}
    style={{
      padding: 5,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'lightgrey',
    }}
  >
    <Button
      title="Dismiss"
      onPress={consumeToast}
    />
  </View>
);

const ProgressToast = ({ animLifespan, ...extraProps }) => (
  <View
    {...extraProps}
    style={{
      padding: 5,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'lightgrey',
    }}
  >
    <Animated.View
      style={{
        width: 200,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        opacity: Animated.subtract(
          1,
          animLifespan,
        ),
        transform: [
          {
            scaleX: animLifespan,
          },  
        ],
      }}
    />
  </View>
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
      ({ ...extraProps }) => (
        <NotificationBread
          {...extraProps}
          title="🍞 Welcome to Buttered Toast!"
          image="https://i.pinimg.com/originals/31/8a/80/318a80fb5c4bba7b8ac8754e63398c07.jpg"
          description="A simple, configurable manager for your toast notifications. Any arbitrary React component can be displayed as a notification."
        />
      ),
    );
    makeToast(
      InputToast,
    )
      .then(() => makeToast(
        ProgressToast,
        {
          lifespan: 1000,
        },
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
