import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useContext, useEffect, useState } from "react";
import color from "../misc/color";
import PlayListInputModal from "../components/PlayListInputModal";
import { AudioContext } from "../Context/AudioProvider";
import PlayListDetail from "../components/PlayListDetail";

let selectedPlayList = {};

export default function PlayList({ navigation }) {
  const [modalVisibile, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  useEffect(() => {
    console.log(modalVisibile);
  });

  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];

      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    console.log("playlist: ", playList);
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My Favorite",
        audios: [],
      };
      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }

    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  });

  const handleBannerPress = async (playList) => {
    // update playList if there is any selected audio
    console.log("press: ", addToPlayList);
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");

      let oldList = [];
      let sameAudio = false;
      let updateList = [];

      if (result !== null) {
        oldList = JSON.parse(result);

        updateList = oldList.filter((list) => {
          if (list.id === playList.id) {
            // we want to check is that same audio is already inside out list or not
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                // alert with some message
                sameAudio = true;
                return;
              }
            }

            // otherwise update playList if there is any selected audio
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          "Found same audio!",
          `${addToPlayList.filename} is already inside the list.`
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }
      updateState(context, { addToPlayList: null, playList: [...updateList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updateList]));
    }
    // if there is no audio selected then we want open the list
    selectedPlayList = playList;
    setShowPlayList(true);
  };

  const handlePress = () => {
    navigation.navigate("Player");
    setShowPlayList(false);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: color.APP_BG }}
      >
        <View>
          <Text style={styles.titlePage}>PlayList</Text>
        </View>
        {playList.length
          ? playList.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={styles.playListBanner}
                  onPress={() => {
                    handleBannerPress(item);
                  }}
                >
                  <Text style={styles.audioTitle}>{item.title}</Text>
                  <Text style={styles.audioCount}>
                    {item?.audios?.length > 1
                      ? `${item.audios.length} Songs`
                      : `${item.audios.length} Song`}
                  </Text>
                </TouchableOpacity>
              );
            })
          : null}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.playListBtn}>+ Add New PlayList</Text>
        </TouchableOpacity>
        <PlayListInputModal
          visible={modalVisibile}
          onClose={() => setModalVisible(false)}
          onSubmit={createPlayList}
        />
      </ScrollView>
      <PlayListDetail
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
        onPress={handlePress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titlePage: {
    color: "#a01571",
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginBottom: 15,
  },
  playListBanner: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(204, 204, 204, .3)",
    borderRadius: 15,
    marginBottom: 15,
  },
  audioTitle: {
    color: "#ddd",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
    color: "#ccc",
  },
  playListBtn: {
    color: color.FONT_MEDIUM,
    letterSpacing: 3,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});
