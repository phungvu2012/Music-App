import { Text, View, Alert } from "react-native";
import React, { Component, createContext } from "react";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from 'recyclerlistview'

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2)
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
    const {dataProvider, audioFiles} = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });

    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });

    // console.log(media.assets);
    
    const tmp = [];
    media.assets = media.assets.map(value => {
      return ({
        ...value,
        'url': value.uri,
        'title': value.fullname
      })
    })

    this.setState({ ...this.state,dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]),audioFiles: [...audioFiles, ...media.assets] });
  };

  getPermission = async () => {
    // Object {
    //   "canAskAgain": true,
    //   "expires": "never",
    //   "granted": false,
    //   "status": "undetermined",
    // }
    const permission = await MediaLibrary.getPermissionsAsync();
    console.log(permission);
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

  render() {
    const {audioFiles, dataProvider, permissionError} = this.state

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
      <AudioContext.Provider value={{ audioFiles, dataProvider }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
