import TrackPlayer from "react-native-track-player";
import { Event } from "react-native-track-player";
// service.js
module.exports = async function () {
  TrackPlayer.addEventListener("remote-play", () => TrackPlayer.play());

  TrackPlayer.addEventListener("remote-pause", () => TrackPlayer.pause());

  TrackPlayer.addEventListener("remote-stop", () => TrackPlayer.destroy());

  TrackPlayer.addEventListener("remote-next", async () => {
    console.log("next");
    await TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener("remote-previous",async () => {
    console.log("pre");
    await TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener("remote-seek", async ({ position }) => {
    console.log("seek to", position);
    await TrackPlayer.seekTo(position);
  });
};
