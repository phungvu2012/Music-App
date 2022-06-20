import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";


import Player from "./Player";
import AudioList from "./AudioList";
import { AudioControllerContext } from "../Context/AudioController";
import PlayList from "./PlayList";
import PlayListDetail from "../components/PlayListDetail";

const Tab = createBottomTabNavigator();

const AudioScreen = () => {
  const audioControllerContext = useContext(AudioControllerContext);

  useEffect(() => {
    // console.log(audioControllerContext);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarStyle: { backgroundColor: "#222831" },
        headerPressColor: "#fff",
        // tabBarActiveTintColor: "#FFD369",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Audio List"
        component={AudioList}
        options={{
          tabBarIcon: (color, size = 24) => {
            return <FontAwesome5 name="headset" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="PlayList"
        component={PlayList}
        options={{
          tabBarIcon: (color, size = 24) => {
            return (
              <MaterialIcons name="library-music" size={size} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AudioScreen;

const styles = StyleSheet.create({});
