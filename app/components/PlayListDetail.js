import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import color from "../misc/color";
import AudioListItem from "./AudioListItem";
import TrackPlayer from "react-native-track-player";
import OptionModal from "./OptionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {AudioContext} from "../Context/AudioProvider";

const PlayListDetail = ({ visible, playList, onClose, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const context = useContext(AudioContext);

  useEffect(() => {
    setAudios(playList.audios)
    console.log('hello2: ', playList.audios)
  }, [playAudio, playList?.audios])

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };

  const removeAudio = async () => {
    const newAudios = audios.filter((audio) => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem("playlist");

    if (result !== null) {
      const oldPlayList = JSON.parse(result);
      const updatePLaylist = oldPlayList.filter((item) => {
        if (item.id === playList.id) {
          item.audios = newAudios;
        }

        return item;
      });

      AsyncStorage.setItem("playlist", JSON.stringify(updatePLaylist));
      context.updateState(context, { playList: updatePLaylist });
    }
    setAudios(newAudios);

    closeModal();
    console.log(selectedItem);
  };

  const playAudio = async (audio, index) => {
    // console.log("audios: ", playList.audios);
    console.log("Playlist Index: ", index);
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
          data={audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 10 }}>
              <AudioListItem
                title={item.filename}
                duration={item.duration}
                onAudioPress={() => playAudio(item, index)}
                onOptionPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            </View>
          )}
        />
      </View>
      <View style={[StyleSheet.absoluteFill, styles.modalBG]}></View>
      <OptionModal
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem}
      />
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
    backgroundColor: "#724b66",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});
