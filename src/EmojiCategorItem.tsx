import React from 'react';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {Text, View} from 'react-native';
import {string} from 'react-native-redash';
interface EmojiCategorItem {
  item: {
    name: string;
    symbol: string;
  };
  onPress(): void;
  activeCategory: any;
  tabSize: number;
  theme: any;
}

const EmojiCategorItem = ({
  item,
  onPress,
  activeCategory,
  tabSize,
  theme,
}: EmojiCategorItem) => {
  if (item.name != 'All') {
    return (
      <TapGestureHandler
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            onPress();
          }
        }}>
        <Animated.View
          key={item.name}
          style={{
            flex: 1,
            width: tabSize,
            height: tabSize,

            borderColor: item === activeCategory ? theme : '#EEEEEE',
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // transform: [{scale}],
          }}>
          <Text
            style={{
              textAlign: 'center',
              paddingBottom: 8,
              fontSize: tabSize - 24,
            }}>
            {item.symbol}
          </Text>
        </Animated.View>
      </TapGestureHandler>
    );
  } else {
    return <View />;
  }
};

export default EmojiCategorItem;
