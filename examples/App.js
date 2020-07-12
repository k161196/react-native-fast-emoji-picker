/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import EmojiSelector from 'react-native-fast-emoji-picker';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [emoji, setEmoji] = useState('😁');
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 100}}>{emoji}</Text>
        </View> */}
        <View style={{flex: 1}}>
          <EmojiSelector
            onEmojiSelected={(emoji) => setEmoji(emoji)}
            columns={5}
            // showSectionTitles={false}
            // showSearchBar={false}
            // showTabs={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
