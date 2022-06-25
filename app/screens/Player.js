import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlayerImage1 from "./../../assets/blu-music-logo-4_800x600.gif";
import PlayerImage2 from "./../../assets/200.gif";
import PlayerImage3 from "./../../assets/20108dbb48dbad29646e0f2cf022ce73.gif";
import PlayerImage4 from "./../../assets/ComfortableFlawedChevrotain-max-1mb.gif";
import PlayerImage5 from "./../../assets/blu-music-logo-4_800x600.gif";
import Slider from "@react-native-community/slider";

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

const { width, height } = Dimensions.get("window");

const getCurrentTrack = async () => {
  const songArr = await TrackPlayer.getQueue();
  return songArr;
};

const random = (min, max) => {
  console.log(Math.floor(Math.random() * (max - min + 1) + min));
  return Math.floor(Math.random() * (max - min) + min);
};

const arrPlayingImage = [
  PlayerImage1,
  PlayerImage2,
  PlayerImage3,
  PlayerImage4,
  PlayerImage5,
];

export default function Player() {
  const playbackState = usePlaybackState();
  const [songs, setSong] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [songIndex, setSongIndex] = useState(0);
  const progress = useProgress();
  const [repeatMode, setRepeatMode] = useState("off");

  const [trackArtwork, setTrackArtwork] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [isEndQueue, setIsEndQueue] = useState(false);

  const songSlider = useRef(null);

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged],
    async (event) => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== null
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const { title, artwork, astist } = track;
        setTrackTitle(title);
        setTrackArtist(astist);
        setTrackArtwork(arrPlayingImage[artwork] || arrPlayingImage[0]);
        // console.log("artwork: ", track)
        // console.log("songIndex: ", songIndex);
        if (repeatMode === "off") setIsEndQueue(false);
        if (songIndex > songs.length - 1) {
          console.log("end queue: ");
          setIsEndQueue(true);
        }
      }
      console.log('change')
    }
  );

  useTrackPlayerEvents(
    [Event.PlaybackQueueEnded],
    async (event) => {
      if(event.type === Event.PlaybackQueueEnded()) {
      }
      // console.log('end pppppppppppppppppppppppppp')
    }
  );

  const repeatIcon = () => {
    if (repeatMode === "off") {
      return "repeat-off";
    }
    if (repeatMode === "track") {
      return "repeat-once";
    }
    if (repeatMode === "repeat") {
      return "repeat";
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === "off") {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode("track");
    }
    if (repeatMode === "track") {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode("repeat");
    }
    if (repeatMode === "repeat") {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode("off");
    }
  };

  const skipTo = (trackId) => {
    TrackPlayer.skip(trackId);
    console.log('-------------------------------------------- skip')
  };

  useEffect(() => {
    getCurrentTrack().then((data) => {
      setSong([...data]);
    });

    const getCurrentAudioData = async () => {
      const track = await TrackPlayer.getCurrentTrack();
      TrackPlayer.getTrack(track).then((data) => {
        const { title, artwork, astist } = data;
        setTrackTitle(title);
        setTrackArtist(astist);
        setTrackArtwork(artwork);
        
        if (songIndex > songs.length - 1) {
          console.log("end queue: ", songIndex, " - ", songs.length - 1);
          setIsEndQueue(true);
        }
      });
    };

    getCurrentAudioData();

    scrollX.addListener(({ value }) => {
      // console.log("ScrollX: ", scrollX);
      // console.log("Device Width: ", width);

      const index = Math.round(value / width);
      skipTo(index);
      setSongIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // console.log('hello: ', Math.floor(progress.duration), Math.floor(progress.position))
    // console.log('dk: ', isEndQueue)
    if (
      repeatMode === "off" &&
      Math.floor(progress.duration) - Math.floor(progress.position) <= 0 &&
      isEndQueue
    ) {
      TrackPlayer.pause();
      TrackPlayer.seekTo(0);
    }
  }, [progress]);

  useEffect(() => {
    setIsEndQueue(songIndex === songs?.length - 1);
  }, [trackTitle, trackArtist, trackArtwork]);

  useEffect(() => {
    
  })

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const togglePlayBack = async (playbackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      if (playbackState === State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.artworkWrapper}>
          <Image
            source={
              trackArtwork
                ? trackArtwork
                : arrPlayingImage[item.id % (arrPlayingImage.length - 1) || 0]
            }
            style={styles.artworkImage}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={{ width: width }}>
            <Animated.FlatList
              ref={songSlider}
              data={songs}
              renderItem={renderSongs}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: { x: scrollX },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
            />
          </View>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {trackTitle || "???"}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {trackArtist || "V.A"}
            </Text>
          </View>
          <View>
            <Slider
              style={styles.progressContainer}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#FFD369"
              minimumTrackTintColor="#FFD369"
              maximumTrackTintColor="#FFF"
              onSlidingComplete={async (value) => {
                console.log(Number(value) < Number(progress.position))
                if(Number(value) < Number(progress.duration) || !isEndQueue) 
                  await TrackPlayer.seekTo(value);
                else {
                  console.log('seek')
                  await TrackPlayer.pause()
                  await TrackPlayer.seekTo(0);
                }
              }}
            />
            <View style={styles.progressLabelContainer}>
              <Text style={styles.progressLabelText}>
                {new Date(progress.position * 1000).toISOString().substr(14, 5)}
              </Text>
              <Text style={styles.progressLabelText}>
                {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
              </Text>
            </View>
          </View>
          <View style={styles.musicControlls}>
            <TouchableOpacity onPress={skipToPrevious}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                color="#ffd369"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => togglePlayBack(playbackState)}>
              <Ionicons
                name={
                  playbackState === State.Playing
                    ? "ios-pause-circle"
                    : "ios-play-circle"
                }
                size={75}
                color="#ffd369"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <Ionicons
                name="play-skip-forward-outline"
                size={35}
                color="#ffd369"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomControls}>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart-outline" size={30} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity onPress={changeRepeatMode}>
              <MaterialCommunityIcons
                name={`${repeatIcon()}`}
                size={30}
                color={repeatMode !== "off" ? "#FFD369" : "#777777"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="share-outline" size={30} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="ellipsis-horizontal" size={30} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222831",
  },
  artworkWrapper: {
    width: 300,
    height: 300,
    marginBottom: 25,

    borderRadius: 150,

    shadowColor: "#ccc",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,

    elevation: 5,

    overflow: "hidden",

  },
  artworkImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#EEE",
    paddingHorizontal: 16,
  },
  artist: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    color: "#EEE",
    marginTop: 8,
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelText: {
    color: "#fff",
  },
  musicControlls: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
    marginTop: 15,
  },
  bottomContainer: {
    borderTopColor: "#393E46",
    borderTopWidth: 1,
    width: width,
    alignItems: "center",
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
