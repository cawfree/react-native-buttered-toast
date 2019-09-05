import React from 'react';
import {
  Easing,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { merge as mergeDeep } from 'lodash';
import uuidv4 from 'uuid/v4';

import Butter from './Butter';

const styles = StyleSheet
  .create(
    {
      containerStyle: {
        //width: Dimensions.get('window').width,
        //flex: 1,
      },
    },
  );

const makeOptions = {
  containerStyle: styles.ContainerStyle,
  duration: 1000,
  easing: Easing.bounce,
};

const consumeOptions = {
  duration: 500,
  easing: Easing.cubic,
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
    uuids: [],
    processing: false,
    pendingTasks: [],
  };
  processPendingTasks = (extraTask) => {
    const { 
      width,
      height,
      processing,
    } = this.state;
    return new Promise(
      (resolve) => {
        if (!!extraTask) {
          Object.assign(
            this.state,
            {
              pendingTasks: [
                ...this.state.pendingTasks,
                () => extraTask()
                  .then(resolve),
              ],
            },
          );
        }
        if (!processing && ButteredToastProvider.hasLayout(width, height)) {
          const [
            nextTask,
            ...extraTasks
          ] = this.state.pendingTasks;
          const hasNextTask = (!!nextTask);
          Object.assign(
            this.state,
            {
              processing: hasNextTask,
              pendingTasks: extraTasks,
            },
          );
          if (hasNextTask) {
            return nextTask()
              .then(() => {
                Object.assign(
                  this.state,
                  {
                    processing: false,
                  },
                );
                return this.processPendingTasks(null);
              });
          }
          return resolve();
        }
      },
    );
  };
  consumeToast = (toastId, options = consumeOptions) => {
    const shouldConsumeToast = () => Promise
      .resolve()
      .then(
        () => mergeDeep(
          options || {},
          consumeOptions,
        ),
      )
      .then(
        ({ duration, easing }) => {
          const { uuids } = this.state;
          const index = uuids
            .indexOf(
              toastId,
            );
          if (index < 0) {
            return Promise
              .reject(
                new Error(
                  `Attempted to consume unrecognized toastId "${JSON.stringify(
                    toastId,
                  )}".`,
                ),
              );
          }
          return {
            index,
            duration,
            easing,
          };
        },
      )
      .then(
        ({ index, duration, easing }) => {
          const {
            paddingRight,
            paddingBottom,
            paddingBetween,
          } = this.props;
          const {
            width,
            height,
            children,
            animValues,
            dimensions,
            uuids,
          } = this.state;
          const animValue = animValues[index];
          const {
            width: viewWidth,
            height: viewHeight,
          } = dimensions[index];
          const y = dimensions
            .filter((_, i) => i > index)
            .reduce(
              (n, { height }) => (
                (height + n) + paddingBetween
              ),
              paddingBottom,
            );
          return new Promise(
            resolve => Animated
              .timing(
                animValue,
                {
                  toValue: {
                    x: width,
                    y: (height - y) - viewHeight,
                  },
                  duration,
                  easing,
                  useNativeDriver: true,
                },
              )
              .start(resolve),
          )
            .then(() => index);
        },
      )
      .then(
        (index) => new Promise(
          resolve => this.setState(
            {
               children: this.state.children
                 .filter((_, i) => i !== index),
               animValues: this.state.animValues
                 .filter((_, i) => i !== index),
               dimensions: this.state.dimensions
                 .filter((_, i) => i !== index),
               uuids: this.state.uuids
                 .filter((_, i) => i !== index),
            },
            resolve,
          ),
        ),
      )
      .then(
        () => {
          const {
            paddingRight,
            paddingBottom,
            paddingBetween,
            duration,
            easing,
          } = this.props;
          const {
            width,
            animValues,
            dimensions,
            height,
          } = this.state;
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
            resolve => Animated
              .parallel(
                [
                  ...animValues
                    .map(
                      (animValue, i) => Animated.timing(
                        animValue,
                        {
                          toValue: {
                            x: width - (dimensions[i].width + paddingRight),
                            y: targets[i] + height,
                          },
                          duration,
                          useNativeDriver: true,
                          easing,
                        },
                      ),
                    ),
                ],
              )
              .start(resolve),
          );
        },
      );
    return this.processPendingTasks(
      shouldConsumeToast,
    );
  };
  makeToast = (Bread, options = makeOptions) => {
    const shouldMakeToast = () => Promise
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
            makeOptions,
          );
        },
      )
      .then(
        ({
          containerStyle,
          duration,
          easing,
        }) => {
          const { height } = this.state;
          const animValue = new Animated
            .ValueXY(
              {
                x: 0,
                y: height,
              },
            );
          const toastId = uuidv4();
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
                      consumeToast={() => this.consumeToast(
                        toastId,
                      )}
                      onLayout={({ nativeEvent: { layout: { width, height } }}) => resolve(
                        {
                          width,
                          height,
                          animValue,
                          duration,
                          easing,
                        },
                      )}
                    />
                  </Butter>
                ],
                animValues: [
                  ...this.state.animValues,
                  animValue,
                ],
                uuids: [
                  ...this.state.uuids,
                  toastId,
                ],
              },
            ),
          );
        },
      )
      .then(
        ({ width, height, animValue, duration, easing }) => new Promise(
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
                duration,
                easing,
              },
            )
          ),
        ),
      )
      .then(
        ({ animValue, duration, easing }) => {
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
                          duration,
                          easing,
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
          const { uuids } = this.state;
          return uuids[uuids.length - 1];
        },
      );
    return this.processPendingTasks(
      shouldMakeToast,
    );
  };
  onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    const shouldInit = !ButteredToastProvider
      .hasLayout(
        this.state.width,
        this.state.height,
      );
    return this.setState(
      {
        width,
        height,
      },
      () => (!!shouldInit) && this.processPendingTasks(
        null,
      ),
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
    const {
      makeToast,
      consumeToast,
    } = this;
    return (
      <ButteredToastContext.Provider
        value={{
          makeToast,
          consumeToast,
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
  duration: PropTypes.number,
  easing: PropTypes.func,
};

ButteredToastProvider.defaultProps = {
  paddingBottom: 30,
  paddingRight: 10,
  paddingBetween: 10,
  duration: 1000,
  easing: Easing.bounce,
};

export default ButteredToastProvider;
