import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import AudioController from "./app/Context/AudioController";
import AudioProvider from "./app/Context/AudioProvider";
import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {
  return (
    <AudioProvider>
      {/* <AudioController> */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      {/* </AudioController> */}
    </AudioProvider>
    // <View style={{ marginTop: 50 }}>
    //   <AudioListItem />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
