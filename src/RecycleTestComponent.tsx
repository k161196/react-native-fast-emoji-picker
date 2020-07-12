import React, { Component } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import emoji from "emoji-datasource";
import Animated from "react-native-reanimated";

import { TapGestureHandler, State } from "react-native-gesture-handler";
import TabBar from "./TapBar";

import Categories from "./Categories";
import SearchBar from "./SearchBar";

const charFromUtf16 = (utf16: any) =>
  String.fromCodePoint(...utf16.split("-").map((u: string) => "0x" + u));
export const charFromEmojiObject = (obj: { unified: string }) =>
  charFromUtf16(obj.unified);
const filteredEmojis = emoji.filter(
  (e: { [x: string]: any }) => !e["obsoleted_by"]
);
const emojiByCategory = (category: any) =>
  filteredEmojis.filter((e: { category: any }) => e.category === category);
const sortEmoji = (list: any[]) =>
  list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};
interface PropsType {
  theme?: any;
  columns?: number;
  placeholder?: string;
  showSearchBar?: boolean;
  showSectionTitles?: boolean;
  showTabs?: boolean;
  onEmojiSelected(emoji: string): void;
}
export default class RecycleTestComponent extends React.Component<PropsType> {
  state = {
    searchQuery: "",
    category: Categories.all,
    isReady: false,
    emojiList: null,
    colSize: 40,
    width: null,
  };
  dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });
  private _layoutProvider: LayoutProvider;
  constructor(args: any) {
    super(args);
    this._layoutProvider = new LayoutProvider(
      (index) => {
        return 0;
      },
      (type, dim) => {
        dim.width = this.state.colSize - 0.0001;
        dim.height = this.state.colSize;
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);
  }

  handleTabSelect = (category: Object) => {
    if (true) {
      if (this.scrollview)
        this.scrollview.scrollToOffset({
          x: 0,
          y: 0,
          animated: false,
        });
      this.setState({
        searchQuery: "",
        category,
      });
    }
  };
  handleEmojiSelect = (emoji: { unified: string }) => {
    this.props.onEmojiSelected(charFromEmojiObject(emoji));
  };

  handleSearch = (searchQuery: string) => {
    this.setState({ searchQuery });
  };

  returnSectionData() {
    const { emojiList, searchQuery, category } = this.state;

    let emojiData = (function () {
      if (category === Categories.all && searchQuery === "") {
        //TODO: OPTIMIZE THIS
        let largeList = [];
        categoryKeys.forEach((c) => {
          const name = Categories[c].name;
          const list = emojiList[name];
          if (c !== "all") largeList = largeList.concat(list);
        });

        return largeList.map((emoji) => ({
          key: emoji.unified,
          emoji,
        }));
      } else {
        let list;
        const hasSearchQuery = searchQuery !== "";
        const name = category.name;
        if (hasSearchQuery) {
          const filtered = emoji.filter((e: { short_names: any[] }) => {
            let display = false;
            e.short_names.forEach((name) => {
              if (name.includes(searchQuery.toLowerCase())) display = true;
            });
            return display;
          });
          list = sortEmoji(filtered);
        } else {
          list = emojiList[name];
        }
        return list.map((emoji: { unified: string }) => ({
          key: emoji.unified,
          emoji,
        }));
      }
    })();
    return this.props.shouldInclude
      ? emojiData.filter((e: { emoji: { unified: string } }) =>
          this.props.shouldInclude(e.emoji)
        )
      : emojiData;
  }

  _rowRenderer(type: any, data: { emoji: { unified: any } }) {
    return (
      <TapGestureHandler
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            // console.log(event);
            this.handleEmojiSelect(data.emoji);
          }
        }}
      >
        <Animated.View
          key={emoji}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: this.state.colSize - 15,
            }}
          >
            {charFromEmojiObject(data.emoji)}
          </Text>
        </Animated.View>
      </TapGestureHandler>
    );
  }
  handleLayout = ({ nativeEvent: { layout } }) => {
    let emojiList = {};
    categoryKeys.forEach((c) => {
      let name = Categories[c].name;
      emojiList[name] = sortEmoji(emojiByCategory(name));
    });

    this.setState({
      colSize: Math.floor(layout.width / this.props.columns),
      emojiList,
    });
  };

  render() {
    const {
      theme,
      columns,
      placeholder,
      showSearchBar,
      showSectionTitles,
      showTabs,
      ...other
    } = this.props;

    const { category, searchQuery } = this.state;

    const title = searchQuery !== "" ? "Search Results" : category.name;
    const dataListStore =
      this.state.emojiList &&
      this.dataProvider.cloneWithRows(this.returnSectionData());

    return (
      <View style={styles.frame} onLayout={this.handleLayout}>
        {this.state.colSize && this.state.emojiList ? (
          <View style={{ flex: 1 }}>
            <View style={[styles.tabBar]}>
              {showTabs && (
                <TabBar
                  activeCategory={category}
                  onPress={this.handleTabSelect}
                  theme={theme}
                  width={this.state.colSize!}
                />
              )}
            </View>
            {showSearchBar && (
              <SearchBar
                theme={theme}
                handleSearch={this.handleSearch}
                searchQuery={searchQuery}
                placeholder={placeholder}
              />
            )}
            {showSectionTitles && (
              <View
                style={{
                  // backgroundColor: 'red',
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{title}</Text>
              </View>
            )}

            {dataListStore._data.length ? (
              <RecyclerListView
                layoutProvider={this._layoutProvider}
                dataProvider={dataListStore!}
                // optimizeForInsertDeleteAnimations={true}
                scrollThrottle={16}
                rowRenderer={this._rowRenderer}
                // style={{height: 400, width: 400}}
              />
            ) : (
              <Text>NO Data</Text>
            )}
          </View>
        ) : (
          <View style={styles.loader}>
            <ActivityIndicator
              size={"large"}
              color={Platform.OS === "android" ? this.props.theme : "#000000"}
            />
          </View>
        )}
      </View>
    );
  }
}
RecycleTestComponent.defaultProps = {
  showTabs: true,
  showSearchBar: true,
  showSectionTitles: true,
  columns: 6,
  placeholder: "Search Emoji",
};
const styles = {
  frame: {
    flex: 1,

    // backgroundColor: 'red',
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
  },
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00a1f1",
  },
  containerGridLeft: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#ffbb00",
  },
  containerGridRight: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#7cbb00",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
};
