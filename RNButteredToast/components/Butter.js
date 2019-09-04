import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  PanResponder,
  View,
} from 'react-native';

class Butter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animShow: new Animated.Value(0),
      animToasting: new Animated.Value(0),
      animHide: new Animated.Value(0),
      panResponder: PanResponder
        .create(
          {
            onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
            onPanResponderGrant: this.onPanResponderGrant,
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
  onStartShouldSetPanResponder = (e, gestureState) => {
    // TODO:
    return false;
  };
  onPanResponderGrant = (e, gestureState) => {
  };
  onPanResponderMove = (e, gestureState) => {
    const { animDrag } = this.state;
    return Animated.event(
      [
        null,
        {
          dx: animDrag.x,
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
  };
  onPanResponderTerminate = (e, gestureState) => {
  };
  render() {
    const {
      animValue,
      containerStyle,
      children,
      ...extraProps
    } = this.props;
    const {
      animShow,
      animToasting,
      animHide,
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
