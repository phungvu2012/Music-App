import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import PlayingImage from "./../../assets/musicplaying.gif";

const getThumbnailText = (filename) => {
  return filename[0];
};

const convertTime = (minutes) => {
  return new Date(minutes * 1000).toLocaleTimeString().substring(3);
};

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />;
  else return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />;
};

export default function AudioListItem({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) {
  
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.ACTIVE_BG
                    : color.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
              {/* {isPlaying && <Image source={PlayingImage} style={styles.playingAudio} />} */}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.timeText} numberOfLines={1}>
                {convertTime(duration)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={color.FONT_MEDIUM}
            onPress={onOptionPress}
            style={{ padding: 10 }}
          />
        </View>
      </View>
      <View style={styles.separator}></View>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 80,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    position: "relative",
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    overflow: "hidden",
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.FONT,
  },
  playingAudio: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    opacity: 0.2,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
});
