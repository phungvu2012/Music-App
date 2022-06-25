import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import color from "../misc/color";
import AudioListItem from "./AudioListItem";
import TrackPlayer from 'react-native-track-player'

const PlayListDetail = ({ visible, playList, onClose, onPress }) => {
  const playAudio = async (audio, index) => {
    // console.log("audios: ", playList.audios);
    console.log('Playlist Index: ', index)
    await TrackPlayer.reset();
    if (playList.audios?.length > 0) {
    }
    await TrackPlayer.add(playList.audios);
    await TrackPlayer.play();
    await TrackPlayer.skip(index);
    onPress();
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 10 }}>
              <AudioListItem
                title={item.filename}
                duration={item.duration}
                onAudioPress={() => playAudio(item, index)}
              />
            </View>
          )}
        />
      </View>
      <View style={[StyleSheet.absoluteFill, styles.modalBG]}></View>
    </Modal>
  );
};

export default PlayListDetail;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    height: height,
    width: width - 15,
    backgroundColor: "#523b76",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 15,
    // paddingTop: 20,
    fontWeight: "bold",
    color: color.FONT,
    backgroundColor: '#724b66',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});
