import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  PanResponder,
  View,
  Dimensions,
} from 'react-native';

const {
  width: screenWidth,
} = Dimensions.get('window');

class Butter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panResponder: PanResponder
        .create(
          {
            onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: this.onPanResponderTerminate,
          },
        ),
      animDrag: new Animated.ValueXY(
        {
          x: 0,
          y: 0,
        },
      ),
    };
  }
  onStartShouldSetPanResponder = (e, gestureState) => false;
  onMoveShouldSetPanResponder = (e, gestureState) => {
    const { requestDrag } = this.props;
    const { dx } = gestureState;
    // XXX: Ensure the user has actually started dragging.
    return (Math.abs(dx) >= 5) && requestDrag();
  };
  onPanResponderMove = (e, gestureState) => {
    const { animDrag } = this.state;
    const { dx } = gestureState;
    return Animated.event(
      [
        null,
        {
          dx: dx > 0 ? animDrag.x : 0,
          dy: 0,
          useNativeDriver: true,
        }
      ],
    )(
      e,
      gestureState,
    );
  };
  onPanResponderRelease = (e, gestureState) => {
    const { finishDrag } = this.props;
    const { dx } = gestureState;
    const shouldConsume = dx > (screenWidth * 0.25);
    return this.handleFinishDrag(
      e,
      gestureState,
      shouldConsume,
    );
  };
  onPanResponderTerminate = (e, gestureState) => {
    return this.handleFinishDrag(
      e,
      gestureState,
      false,
    );
  };
  handleFinishDrag = (e, gestureState, shouldConsume) => {
    const { finishDrag } = this.props;
    const { animDrag } = this.state;
    if (shouldConsume) {
      return Promise
        .resolve()
        .then(
          () => finishDrag(
            true,
          ),
        );
    }
    return new Promise(
      resolve => Animated
        .timing(
          animDrag,
          {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
            duration: 100,
          },
        )
        .start(resolve),
    )
      .then(
        () => finishDrag(
          false,
        ),
      );
  };
  render() {
    const {
      animValue,
      containerStyle,
      children,
      ...extraProps
    } = this.props;
    const {
      animDrag,
      panResponder,
      ...extraState
    } = this.state;
    return (
      <Animated.View
        {...panResponder.panHandlers}
        {...extraProps}
        style={[
          containerStyle,
          {
            position: 'absolute',
          },
          {
            transform: [
              {
                translateX: Animated.add(
                  animDrag.x,
                  animValue.x,
                ),
              },
              {
                translateY: Animated.add(
                  animDrag.y,
                  animValue.y,
                ),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet
  .create(
    {
      containerStyle: {
      },
    },
  );

Butter.propTypes = {
  animValue: PropTypes.shape({}).isRequired,
  containerStyle: PropTypes.shape({}),
};

Butter.defaultProps = {
  containerStyle: styles.containerStyle,
};

export default Butter;
