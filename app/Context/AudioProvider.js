import { Text, View, Alert } from "react-native";
import React, { Component, createContext } from "react";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";

import PlayerImage1 from "./../../assets/blu-music-logo-4_800x600.gif";
import PlayerImage2 from "./../../assets/200.gif";
import PlayerImage3 from "./../../assets/20108dbb48dbad29646e0f2cf022ce73.gif";
import PlayerImage4 from "./../../assets/ComfortableFlawedChevrotain-max-1mb.gif";
import PlayerImage5 from "./../../assets/blu-music-logo-4_800x600.gif";

const arrPlayingImage = [
  PlayerImage1,
  PlayerImage2,
  PlayerImage3,
  PlayerImage4,
  PlayerImage5,
];

const numberImages = 5

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioFiles: [],
      playList: [],
      addToPlayList: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
    };
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This app needs to read audio files", [
      {
        text: "I am ready",
        onPress: () => this.getPermission(),
      },
      {
        text: "cancle",
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    console.log("media: ", media);

    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });


    const tmp = [];
    media.assets = media.assets.map((value) => {
      // console.log(
      //   "artwork: ",
      //   value.artwork ||
      //     arrPlayingImage[value.id % (arrPlayingImage.length - 1)]
      // );
      return {
        ...value,
        url: value.uri,
        title: value.filename,
        artwork: value.artwork || value.id % (numberImages - 1)
      };
    });

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  getPermission = async () => {
    // Object {
    //   "canAskAgain": true,
    //   "expires": "never",
    //   "granted": false,
    //   "status": "undetermined",
    // }
    const permission = await MediaLibrary.getPermissionsAsync();
    console.log("permission: ", permission);
    if (permission.granted) {
      // we want to get all the audio files
      this.getAudioFiles();
      // console.log(this.state.audioFiles)
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({
        ...this.state,
        permissionError: true,
      });
    }

    if (!permission.granted && permission.canAskAgain) {
      // we want to get all the audio files
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        // we are going to display alert that user must allow this permission to work this app
        // this.permissionAl
      }

      if (status === "granted") {
        // we want to get all the audio files
        this.getAudioFiles();
      }

      if (status === "denied" && !canAskAgain) {
        // we want to display some error to the user
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playList,
      addToPlayList,
    } = this.state;

    if (permissionError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, textAlign: "center", color: "red" }}>
            It looks like you haven't accept the permission
          </Text>
        </View>
      );
    }
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playList,
          addToPlayList,
          updateState: this.updateState,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
