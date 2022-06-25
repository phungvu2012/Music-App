import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import AudioScreen from "../screens/AudioScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#121212',
      },
      headerTintColor: '#eee',

    }}>
      <Stack.Screen name="Danh sach nhac" component={AudioScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Player" component={Player} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
