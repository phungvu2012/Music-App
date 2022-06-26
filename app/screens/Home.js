import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

import PlayerImage1 from "./../../assets/blu-music-logo-4_800x600.gif";
import PlayerImage2 from "./../../assets/200.gif";
import PlayerImage3 from "./../../assets/20108dbb48dbad29646e0f2cf022ce73.gif";
import PlayerImage4 from "./../../assets/ComfortableFlawedChevrotain-max-1mb.gif";
import PlayerImage5 from "./../../assets/blu-music-logo-4_800x600.gif";
import PlayerImage6 from "./../../assets/giphy.gif";
import PlayerImage7 from "./../../assets/music-vintage-background-hand-drawn-illustration-splash-blob-retro-design-with-turntable_251616-1487.webp";
import PlayerImage8 from "./../../assets/giphy2.gif";
import PlayerImage9 from "./../../assets/giphy1.gif";
import PlayerImage10 from "./../../assets/music-background-with-splash-watercolor-heart-sketch-hand-drawn-vector-illustration_251616-2797.webp";

import color from "../misc/color";

import { AudioContext } from "../Context/AudioProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const arrPlayingImage = [
  PlayerImage1,
  PlayerImage2,
  PlayerImage3,
  PlayerImage4,
  PlayerImage5,
  PlayerImage6,
  PlayerImage7,
  PlayerImage8,
  PlayerImage9,
  PlayerImage10,
];

const random = (min, max) => {
  console.log(Math.floor(Math.random() * (max - min + 1) + min));
  return Math.floor(Math.random() * (max - min) + min);
};

const Home = ({navigation}) => {
  const context = useContext(AudioContext);
  const [playList, setPlayList] = useState([]);
  const [audioFile, setAudioFile] = useState(
    context.audioFiles.sort().slice(0, 10) || []
  );

  useEffect(() => {

    const getData = async () => {
      const result = await AsyncStorage.getItem("playlist");
      setPlayList(JSON.parse(result));
      //   console.log('home: ', result)
    };
    getData();
  }, [context.playList?.length]);

  useEffect(() => {
    setAudioFile(context.audioFiles.slice(0, 10));
  }, [context.audioFiles]);

  const playAudioList = async (audios) => {
    if(!Array.isArray(audios) || audios?.length < 1) return;
    // console.log("audios: ", playList.audios);
    await TrackPlayer.reset();
    if (playList.audios?.length > 0) {
    }
    await TrackPlayer.add(audios);
    await TrackPlayer.play();
    navigation.navigate("Player");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.topIconBox}>
            <AntDesign name="search1" size={32} style={styles.topIcons} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Discover</Text>
          <TouchableOpacity onPress={() => {}} style={styles.topIconBox}>
            <Entypo
              name="dots-two-vertical"
              size={32}
              style={styles.topIcons}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.trending}>
          <Text style={styles.trendingTitle}>Playlist</Text>
          <ScrollView
            horizontal={true}
            style={styles.trendingScroll}
            contentContainerStyle={styles.trendingScroll}
          >
            {playList && playList.map((listItem, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => playAudioList(listItem.audios)}
                >
                  <View style={styles.trendingList}>
                    <View style={styles.trendingItem}>
                      <Image
                        source={
                          arrPlayingImage[
                            listItem.id % (arrPlayingImage.length - 1) || 0
                          ]
                        }
                        style={styles.trendingItemImage}
                      />
                      <View style={styles.trendingItemInfo}>
                        <Text
                          style={styles.trendingItemTitle}
                          numberOfLines={1}
                        >
                          {listItem.title}
                        </Text>
                        <Text
                          style={styles.trendingItemArtist}
                          numberOfLines={1}
                        >
                          {listItem.audios.length}{" "}
                          {listItem.audios.length > 1 ? "Songs" : "Song"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.popular}>
            <Text style={styles.popularTitle}>Recently</Text>
            <View style={styles.popularList}>
              {audioFile &&
                audioFile.map((item) => {
                  return (
                    <TouchableOpacity key={item.id}>
                      <View style={styles.popularItem} key={item.title}>
                        <Image
                          source={
                            arrPlayingImage[
                              item.id % (arrPlayingImage.length - 1) || 0
                            ]
                          }
                          style={styles.popularItemImage}
                        />
                        <View style={styles.popularItemContent}>
                          <Text
                            style={styles.popularItemTitle}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={styles.popularItemArtist}
                            numberOfLines={1}
                          >
                            {new Date(item.duration * 1000)
                              .toISOString()
                              .substr(14, 5)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {}}
                          style={styles.popularIconBox}
                        >
                          <Entypo
                            name="dots-three-vertical"
                            size={20}
                            style={styles.popularIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              <TouchableOpacity
                onPress={() => {
                  console.log("press");
                }}
              >
                <View style={styles.popularItem}>
                  <Image
                    source={arrPlayingImage[random(1, 10) || 0]}
                    style={styles.popularItemImage}
                  />
                  <View style={styles.popularItemContent}>
                    <Text style={styles.popularItemTitle} numberOfLines={1}>
                      Chỉ bằng cái gật đầu
                    </Text>
                    <Text style={styles.popularItemArtist} numberOfLines={1}>
                      V.A
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={styles.popularIconBox}
                  >
                    <Entypo
                      name="dots-three-vertical"
                      size={20}
                      style={styles.popularIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.popular}>
            <Text style={styles.popularTitle}>Popular</Text>
            <View style={styles.popularList}>
              <View style={styles.popularItem}>
                <Image
                  source={arrPlayingImage[random(1, 10) || 0]}
                  style={styles.popularItemImage}
                />
                <View style={styles.popularItemContent}>
                  <Text style={styles.popularItemTitle} numberOfLines={1}>
                    Player
                  </Text>
                  <Text style={styles.popularItemArtist} numberOfLines={1}>
                    Soobin Hoàng Sơn
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.popularIconBox}
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={20}
                    style={styles.popularIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.popularItem}>
                <Image
                  source={arrPlayingImage[random(1, 10) || 0]}
                  style={styles.popularItemImage}
                />
                <View style={styles.popularItemContent}>
                  <Text style={styles.popularItemTitle} numberOfLines={1}>
                    Nơi ấy con tìm về
                  </Text>
                  <Text style={styles.popularItemArtist} numberOfLines={1}>
                    Hồ Quang Hiếu
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.popularIconBox}
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={20}
                    style={styles.popularIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.popularItem}>
                <Image
                  source={arrPlayingImage[random(1, 10) || 0]}
                  style={styles.popularItemImage}
                />
                <View style={styles.popularItemContent}>
                  <Text style={styles.popularItemTitle} numberOfLines={1}>
                    Ai mang cô đơn đi
                  </Text>
                  <Text style={styles.popularItemArtist} numberOfLines={1}>
                    KICM
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.popularIconBox}
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={20}
                    style={styles.popularIcon}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  console.log("press");
                }}
              >
                <View style={styles.popularItem}>
                  <Image
                    source={arrPlayingImage[random(1, 10) || 0]}
                    style={styles.popularItemImage}
                  />
                  <View style={styles.popularItemContent}>
                    <Text style={styles.popularItemTitle} numberOfLines={1}>
                      Mãi mãi chẳng là anh
                    </Text>
                    <Text style={styles.popularItemArtist} numberOfLines={1}>
                      V.A
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={styles.popularIconBox}
                  >
                    <Entypo
                      name="dots-three-vertical"
                      size={20}
                      style={styles.popularIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.APP_BG,
  },
  topContainer: {
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
  },
  topIconBox: {
    paddingHorizontal: 20,
  },
  topIcons: {
    color: "#aaa",
  },
  trending: {
    // height: 500,
    paddingHorizontal: 40,
  },
  trendingTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 20,
  },
  trendingScroll: {
    margin: 0,
    padding: 0,
    height: 240,
  },
  trendingList: {
    flexDirection: "row",
  },
  trendingItem: {
    position: "relative",
    height: 240,
    width: 200,
    borderRadius: 20,
    marginRight: 32,
    overflow: "hidden",
  },
  trendingItemImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  trendingItemInfo: {
    position: "absolute",
    bottom: 12,
    left: 2,
    right: 2,

    // height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(20, 20, 20, 0.7)",
  },
  trendingItemTitle: {
    color: "#eee",
    fontWeight: "500",
    fontSize: 16,
    overflow: "hidden",
  },
  trendingItemArtist: {
    color: "#eee",
    fontWeight: "500",
    fontSize: 10,
  },
  popular: {
    marginVertical: 20,
    borderTopColor: "#888",
    borderTopWidth: 1,
    borderStyle: "solid",
  },
  popularTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 20,
  },
  popularList: {
    flexDirection: "column",
  },
  popularItem: {
    position: "relative",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: color.MODAL_BG,
  },
  popularItemImage: {
    width: 60,
    height: "80%",
    borderRadius: 10,
  },
  popularItemContent: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    // height: 75,
  },
  popularItemTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 6,
    fontWeight: "500",
  },
  popularItemArtist: {
    color: "#999",
  },
  popularIconBox: {},
  popularIcon: {
    color: "#888",
  },
});
