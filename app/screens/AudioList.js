import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import React, { Component, useContext } from "react";
import { AudioContext } from "../Context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { AudioControllerContext } from "../Context/AudioController";
import { Ionicons } from "@expo/vector-icons";
import color from "../misc/color";
import { DataProvider } from "recyclerlistview";

export class AudioList extends Component {
  static contextType = AudioControllerContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      soundPlay: null,
      currentAudio: {},
      isPlaying: false,
      textSearch: "",
      dataProviderSearch: new DataProvider((r1, r2) => r1 !== r2),
    };

    this.currentItem = {};
  }

  async componentDidUpdate() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      const song = await TrackPlayer.getTrack(currentTrack);
      if (this.state.currentAudio.toString() !== song) {
        // console.log("changedddd: ", this.state.currentAudio);
      }
    }
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      const song = await TrackPlayer.getTrack(currentTrack);
      // console.log("currentTrack: ", song);
      this.setState({ ...this.state, currentAudio: audio });

      if (song.id !== audio.id || song.url !== audio.url) {
        console.log("skip");
        this.setState({
          ...this.state,
          isPlaying: true,
          soundPlay: "another",
        });
        this.context.anotherAudio(audio, () =>
          this.props.navigation.navigate("Player")
        );
      } else if (this.context.playBackState == State.Paused) {
        console.log("play");
        this.setState({
          ...this.state,
          isPlaying: true,
          soundPlay: "play",
        });
        this.context.playAudio();
        this.props.navigation.navigate("Player");
      } else {
        console.log("pause");
        this.setState({
          ...this.state,
          isPlaying: false,
          soundPlay: "pause",
        });
        this.context.pauseAudio();
        this.props.navigation.navigate("Player");
      }
    } else {
      console.log("new");
      this.setState({
        ...this.state,
        isPlaying: true,
        soundPlay: "new",
        currentAudio: audio,
      });
      this.context.newAudio(audio);
      this.props.navigation.navigate("Player");
    }
  };

  rowRenderer = (type, item, index, extendedState) => {
    // console.log('this.state.currentAudio: ', this.state.currentAudio);
    // console.log("item: ", item);
    // console.log("isIndex: ", this.state.currentAudio === item);
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        activeListItem={
          this.state.currentAudio &&
          item?.id === this.state.currentAudio?.id &&
          item?.url === this.state.currentAudio?.url
        }
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        isPlaying={extendedState.isPlaying}
      />
    );
  };

  filterData = (list, text) => {
    return list.filter((value) => {
      console.log("------------------------------------------");
      console.log(value.title.search(new RegExp(text, "i")));
      return value.title.search(new RegExp(text, "i")) > -1;
    });
  };

  handleSearch = (text, listAudio) => {
    this.setState({
      ...this.state,
      textSearch: text,
      dataProviderSearch: this.state.dataProviderSearch.cloneWithRows(
        this.filterData(listAudio, text)
      ),
    });
    // console.log(this.filterData(listAudio, text));
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, updateState, audioFiles }) => {
          return (
            <AudioControllerContext.Consumer>
              {({ data }) => {
                return (
                  <Screen>
                    <View>
                      <Text style={styles.titlePage}>Library</Text>
                    </View>
                    <View style={styles.searchContainer}>
                      <Ionicons
                        name="ios-search-outline"
                        size={30}
                        color="#777"
                        style={styles.searchIcon}
                      />
                      <TextInput
                        value={this.state.textSearch}
                        onChangeText={(text) =>
                          this.handleSearch(text, audioFiles)
                        }
                        style={styles.searchInput}
                      />
                    </View>
                    {/* {console.log("hello: ", audioFiles)} */}
                    <RecyclerListView
                      dataProvider={
                        this.state.textSearch.trim()
                          ? this.state.dataProviderSearch
                          : dataProvider
                      }
                      layoutProvider={this.layoutProvider}
                      rowRenderer={this.rowRenderer}
                      extendedState={{ isPlaying: this.state.isPlaying }}
                    />
                    <OptionModal
                      onPlayPress={() =>
                        this.handleAudioPress(this.currentItem)
                      }
                      onPlayListPress={() => {
                        updateState(this.context, {
                          addToPlayList: this.currentItem,
                        });
                        this.props.navigation.navigate("PlayList");
                      }}
                      currentItem={this.currentItem}
                      visible={this.state.optionModalVisible}
                      onClose={() =>
                        this.setState({
                          ...this.state,
                          optionModalVisible: false,
                        })
                      }
                    />
                  </Screen>
                );
              }}
            </AudioControllerContext.Consumer>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titlePage: {
    color: "#a01571",
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    backgroundColor: "#321b56",
    borderRadius: 50,
    marginHorizontal: 10,
    marginBottom: 35,
    borderColor: color.ACTIVE_BG,
    borderWidth: 1,
    borderStyle: "solid",
    overflow: "hidden",
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchInput: {
    color: '#aaa',
    flex: 1,
    paddingVertical: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingHorizontal: 15,
  },
});

export default AudioList;
