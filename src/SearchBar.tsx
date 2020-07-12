import React from "react";

import { TextInput } from "react-native-gesture-handler";
import { View, StyleSheet, Platform } from "react-native";
interface Searchbar {
  theme: any;
  handleSearch(searchQuery: string): void;
  searchQuery: string;
  placeholder: string;
}

const Searchbar = ({
  theme,
  handleSearch,
  searchQuery,
  placeholder,
}: Searchbar) => (
  <View style={styles.searchbar_container}>
    <TextInput
      style={styles.search}
      placeholder={placeholder}
      clearButtonMode='always'
      returnKeyType='done'
      autoCorrect={false}
      underlineColorAndroid={theme}
      value={searchQuery}
      onChangeText={handleSearch}
    />
  </View>
);
const styles = StyleSheet.create({
  searchbar_container: {
    width: "100%",
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  search: {
    ...Platform.select({
      ios: {
        height: 36,
        paddingLeft: 8,
        borderRadius: 10,
        backgroundColor: "#E5E8E9",
      },
      android: {
        backgroundColor: "#E5E8E9",
        borderRadius: 50,
        paddingLeft: 20,
      },
    }),
    margin: 8,
  },
});

export default Searchbar;
