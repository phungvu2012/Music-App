import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Audio List"
        component={AudioList}
        options={{
          tabBarIcon: (color, size=24) => {
            return <FontAwesome5 name="headset" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: (color, size=24) => {
            return <FontAwesome5 name="compact-disc" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Play List"
        component={PlayList}
        options={{
          tabBarIcon: (color, size=24) => {
            return <MaterialIcons name="library-music" size={size} color={color} />
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
