import React from 'react';
import {FlatList} from 'react-native-gesture-handler';

import EmojiCategorItem from './EmojiCategorItem';
import Categories from './Categories';
interface item {
  item: {name: string; symbol: string};
}
interface TabBar {
  theme: any;
  activeCategory: {
    name: string;
    symbol: string;
  };
  onPress(item: Object): void;
  width: number;
}

const TabBar = ({theme, activeCategory, onPress, width}: TabBar) => {
  const tabSize = width;
  return (
    <FlatList
      horizontal={true}
      data={Object.values(Categories)}
      renderItem={({item}: item) => (
        <EmojiCategorItem
          item={item}
          activeCategory={activeCategory}
          theme={theme}
          tabSize={tabSize}
          onPress={() => onPress(item)}
        />
      )}
      keyExtractor={(item) => item.name}
    />
  );
};
export default TabBar;
