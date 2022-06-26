import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import Player from "./Player";
import AudioList from "./AudioList";
import { AudioControllerContext } from "../Context/AudioController";
import PlayList from "./PlayList";
import PlayListDetail from "../components/PlayListDetail";
import Home from "./Home";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const AudioScreen = () => {
  const audioControllerContext = useContext(AudioControllerContext);

  useEffect(() => {
    // console.log(audioControllerContext);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#2b174a", position: 'absolute', top: (height), right: 0, left: 0, transform: [{ translateY: -48 }] },
        headerPressColor: "#fff",
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: (color= '#888', size = 24) => {
            return <FontAwesome5 name="home" size={size} color='#888' />;
          },
        }}
      />
      <Tab.Screen
        name="Audio List"
        component={AudioList}
        options={{
          tabBarIcon: (color= '#888', size = 24) => {
            return <FontAwesome5 name="headset" size={size} color='#888' />;
          },
        }}
      />
      <Tab.Screen
        name="PlayList"
        component={PlayList}
        options={{
          tabBarIcon: (color= '#888', size = 24) => {
            return (
              <MaterialIcons name="library-music" size={size} color='#888' />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AudioScreen;

const styles = StyleSheet.create({});
