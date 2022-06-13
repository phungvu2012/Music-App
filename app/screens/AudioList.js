import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
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

export class AudioList extends Component {
  static contextType = AudioControllerContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      soundPlay: null,
      currentAudio: {},
      isPlaying: false,
    };

    this.currentItem = {};
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
    console.log("track player");

    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      const song = await TrackPlayer.getTrack(currentTrack);
      // console.log("currentTrack: ", song);
      this.setState({ ...this.state, currentAudio: song });

      if (song.id !== audio.id || song.url !== audio.url) {
        console.log("skip");
        this.setState({
          ...this.state,
          isPlaying: true,
          soundPlay: "another",
        });
        this.context.anotherAudio(audio);
      } else if (this.context.playBackState == State.Paused) {
        console.log("play");
        this.setState({
          ...this.state,
          isPlaying: true,
          soundPlay: "play",
        });
        this.context.playAudio();
      } else {
        console.log("pause");
        this.setState({
          ...this.state, 
          isPlaying: false,
          soundPlay: "pause",
        });
        this.context.pauseAudio();
      }
    } else {
      console.log("new");
      this.setState({
        ...this.state,
        isPlaying: true,
        soundPlay: "new",
      });
      this.context.newAudio(audio);
    }
  };

  rowRenderer = (type, item, index, extendedState) => {
    // console.log('this.state.currentAudio: ', this.state.currentAudio);
    console.log('item: ', this.state.currentAudio);
    console.log('isIndex: ', this.state.currentAudio === item);
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        activeListItem={this.state.currentAudio && item?.id === this.state.currentAudio?.id && item?.url === this.state.currentAudio?.url}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        isPlaying={extendedState.isPlaying}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <AudioControllerContext.Consumer>
              {({ data }) => {
                return (
                  <Screen>
                    <RecyclerListView
                      dataProvider={dataProvider}
                      layoutProvider={this.layoutProvider}
                      rowRenderer={this.rowRenderer}
                      extendedState={{ isPlaying: this.state.isPlaying }}
                    />
                    <OptionModal
                      onPlayPress={() => console.log("Play audio")}
                      onPlayListPress={() =>
                        console.log("Add audio to playlist")
                      }
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
});

export default AudioList;
