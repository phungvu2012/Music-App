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

  } catch (e) {
    console.log(e);
  }
};

export const AudioControllerContext = createContext();

export default function AudioController({ children }) {
  const [state, setState] = useState();
  const [ playback, setPlayback ] = useState(); // play, pause, another
  const playBackState = usePlaybackState();

  useEffect(() => {
    setupPlayer();
  }, [])

  useEffect(() => {
  }, [playback])

  const togglePlayBack = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log('currentTrack', playBackState, State.Playing);
    if (currentTrack != null) {
      if (playBackState == State.Paused) {
        console.log('play')
        await TrackPlayer.play();
      } else {
        console.log('pause')
        await TrackPlayer.pause();
      }
    }
  };

  const data = {
    playback,
    setPlayback,
    playBackState,
    togglePlayBack
  }

  return (
    <AudioControllerContext.Provider value={data}>
      {children}
    </AudioControllerContext.Provider>
  );
}

const styles = StyleSheet.create({});
