# 🍞 react-native-buttered-toast
An utterly, butterly, customizable toast notification for React Native. Display any React `<Component />` as a Toast notification.

Supports Android, iOS and Web.

<p align="center">
  <img src="./bin/out.gif" alt="react-native-buttered-toast" width="270" height="556">
</p>

## 🚀 Getting Started

Using [`npm`]():

```sh
npm install --save react-native-buttered-toast
```

Using [`yarn`]():

```sh
yarn add react-native-buttered-toast
```

## ✍️ Example

There are a couple of prerequisites to be aware of before using this library:

  - You must use a `<ButteredToastProvider>` at the graphical root of your application.
    - `react-native-buttered-toast` does not render using a `<Modal />`, so any other elements higher in the hierarchy have the potential to render over the top of your notifications.
  - Any component you'd wish to have the ability to generate a toast will need to be wrapped with the `withButter` higher-order component (HOC).

```javascript
import React, { useEffect } from 'react';
import { View, Text, Easing, StyleSheet } from 'react-native';
import ButteredToastProvider, { withButter } from 'react-native-buttered-toast';

const styles = StyleSheet
  .create(
    {
      container: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  );

// XXX: The `withButter` HOC supplies the `makeToast` and `consumeToast` props, used to show and dismiss toasts respectively.
const App = ({ makeToast, consumeToast }) => {
  useEffect(
    () => {
      makeToast(
        ({ ...extraProps }) => (
          <Text
            {...extraProps}
            children="I will be rendered as a draggable, dismissable, toast!"
          />
        ),
        {
          // XXX: Allow swipe to dismiss.
          dismissable: true,
          // XXX: Automatically kill after two seconds.
          lifespan: 2000,
          // XXX: When the toast pops up, make it to bounce!
          easing: Easing.bounce,
        },
      );
    },
  );
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
      ]}
    >
      <Text
        children="This is an example."
      />
    </View>
  );
};

export default ({ ...extraProps }) => {
  const ButteryApp = withButter(
    App,
  );
  return (
    <ButteredToastProvider>
      <ButteryApp
        {...extraProps}
      />
    </ButteredToastProvider>
  );
};

```

## 📌 Props

### `ButteredToastProvider`

Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
paddingBottom|number|no|30| Spacing to apply to the bottom of the toasts.
paddingRight|number|no|10| Spacing to apply to the right of the toasts.
paddingBetween|number|no|10| Spacing to apply between successive toasts.
duration|number|no|500| Default amount of time to automatically consume (hide) a toast.
easing|func|no|Easing.bounce| Easing function when automatically consuming a toast.
-----

### `makeToast` Options

The `makeToast` prop injected by the `ButteredToastProvider` accepts a React Element as the first argument, and an `options` argument as the last. These options default to:

```javascript
{
  containerStyle: styles.containerStyle, // An empty styles object.
  duration: 1200,
  easing: Easing.bounce,
  lifespan: -1, // Must be dismissed.
  dismissable: true,
}
```

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)
