import { StyleSheet, Text, View } from "react-native";
import React, { useContext, createContext, useState, useEffect } from "react";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

const setupPlayer = async () => {
  console.log("controller");
  try {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
  } catch (e) {
    console.log(e);
  }
};

export const AudioControllerContext = createContext();

export default function AudioController({ children }) {
  const [state, setState] = useState();
  const [playback, setPlayback] = useState(); // play, pause, another, new
  const playBackState = usePlaybackState();

  useEffect(() => {
    setupPlayer();
  }, []);

  const playAudio = async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.log("error inside play helper method: ", error?.message);
    }
  };

  const pauseAudio = async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.log("error inside play helper method: ", error?.message);
    }
  };

  const newAudio = async (audio) => {
    try {
      await TrackPlayer.add([audio]);
      await TrackPlayer.play();
    } catch (error) {
      console.log("error inside play helper method: ", error?.message);
    }
  };

  const anotherAudio = async (audio, callback) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add([audio]);
      await TrackPlayer.play();
      if (typeof callback === "function") callback();
    } catch (error) {
      console.log("error inside play helper method: ", error?.message);
    }
  };

  const togglePlayBack = async (newSong) => {};

  const data = {
    playback,
    setPlayback,
    playBackState,
    togglePlayBack,
    playAudio,
    pauseAudio,
    newAudio,
    anotherAudio,
  };

  return (
    <AudioControllerContext.Provider value={data}>
      {children}
    </AudioControllerContext.Provider>
  );
}

const styles = StyleSheet.create({});
