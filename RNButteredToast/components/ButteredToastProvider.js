import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { merge as mergeDeep } from 'lodash';

import Butter from './Butter';

const styles = StyleSheet
  .create(
    {
      containerStyle: {
        width: Dimensions.get('window').width,
        flex: 1,
      },
    },
  );

const defaultOptions = {
  containerStyle: styles.ContainerStyle,
  durations: {
    show: 100,
  },
};

const ButteredToastContext = React
  .createContext(
    null,
  );

export const withButter = (Toast) => {
  class ButteredToast extends React.Component {
    static contextType = ButteredToastContext;
    render() {
      const {
        ...extraProps
      } = this.context;
      return (
        <Toast
          {...extraProps}
        />
      );
    }
  }
  ButteredToast.propTypes = {
    
  };
  ButteredToast.defaultProps = {
    
  };
  return ButteredToast;
};

class ButteredToastProvider extends React.Component {
  static hasLayout = (width, height) => (
    width !== null && height !== null && width !== undefined && height !== undefined && !Number.isNaN(width) && !Number.isNaN(height)
  );
  state = {
    children: [],
    animValues: [],
    dimensions: [],
    width: undefined,
    height: undefined,
  };
  makeToast = (Bread, options = defaultOptions) => Promise
    .resolve()
    .then(
      () => {
        const { width, height } = this.state;
        if (!Bread) {
          return Promise
            .reject(
              new Error(
                `Expected valid element Bread, encountered ${typeof Toast}.`,
              ),
            );
        } else if (!ButteredToastProvider.hasLayout(width, height)) {
          return Promise
            .reject(
              new Error(
                `Layout is not yet ready!`,
              ),
            );
        }
        return mergeDeep(
          options,
          defaultOptions,
        );
      },
    )
    .then(
      ({
        containerStyle,
        durations,
      }) => {
        const { height } = this.state;
        const animValue = new Animated
          .ValueXY(
            {
              x: 0,
              y: height,
            },
          );
        return new Promise(
          resolve => this.setState(
            {
              children: [
                ...this.state.children,
                <Butter
                  key={`${this.state.children.length}`}
                  containerStyle={containerStyle}
                  animValue={animValue}
                >
                  <Bread
                    onLayout={({ nativeEvent: { layout: { width, height } }}) => resolve(
                      {
                        width,
                        height,
                        animValue,
                        durations,
                      },
                    )}
                  />
                </Butter>
              ],
              animValues: [
                ...this.state.animValues,
                animValue,
              ],
            },
          ),
        );
      },
    )
    .then(
      ({ width, height, animValue, durations }) => new Promise(
        resolve => this.setState(
          {
            dimensions: [
              ...this.state.dimensions,
              {
                width,
                height,
              },
            ],
          },
          () => resolve(
            {
              animValue,
              durations,
            },
          )
        ),
      ),
    )
    .then(
      ({ animValue, durations }) => {
        const {
          paddingBottom,
          paddingRight,
          paddingBetween,
        } = this.props;
        const {
          width,
          height,
          animValues,
          dimensions,
        } = this.state;
        const {
          show: showDuration,
        } = durations;
        const { width: viewWidth, height: viewHeight } = dimensions[dimensions.length - 1];
        animValue
          .setValue(
            {
              x: width - (viewWidth + paddingRight),
              y: height,
            },
          );
        const targets = dimensions
          .slice()
          .reverse()
          .reduce(
            (arr, { height }, i) => (
              [
                ...arr,
                ((arr[i - 1] || (-1 * paddingBottom)) - height) - ((!!arr[i - 1]) ? paddingBetween : 0),
              ]
            ),
            [],
          )
          .reverse();
        return new Promise(
          resolve => Animated.parallel(
            [
              ...animValues
                .map(
                  (animValue, i) => Animated
                    .timing(
                      animValue,
                      {
                        toValue: {
                          x: width - (dimensions[i].width + paddingRight),
                          y: targets[i] + height,
                        },
                        useNativeDriver: true,
                        duration: showDuration,
                      },
                    ),
                ),
            ]
              .filter(e => !!e),
          )
            .start(resolve),
        );
      },
    )
    .then(
      () => {
        //Alert.alert('got '+this.state.animValues.length);
      },
    );
  onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    return this.setState(
      {
        width,
        height,
      }
    );
  };
  render() {
    const {
      children,
      paddingBottom,
      paddingRight,
      ...extraProps
    } = this.props;
    const {
      children: toastedChildren,
      width,
      height,
    } = this.state;
    const { makeToast } = this;
    return (
      <ButteredToastContext.Provider
        value={{
          makeToast,
        }}
      >
        {children}
        <View
          onLayout={this.onLayout}
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
        >
          {toastedChildren}
        </View>
      </ButteredToastContext.Provider>
    );
  }
};

ButteredToastProvider.propTypes = {
  paddingBottom: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingBetween: PropTypes.number,
};

ButteredToastProvider.defaultProps = {
  paddingBottom: 30,
  paddingRight: 10,
  paddingBetween: 10,
};

export default ButteredToastProvider;
