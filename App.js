import Expo from "expo";
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
} from "react-native";
import Login from "./src/Login";
import AuthContext from "./src/auth/context";
import ImagePicker from "./src/ImagePicker/ImagePicker";
import * as Permissions from "expo-permissions";
import storage from "./src/auth/storage";
import AppLoading from "expo-app-loading";

export default function App() {
  const [user, setuser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [permission, askForPermission] = Permissions.usePermissions(
    [Permissions.CAMERA, Permissions.MEDIA_LIBRARY],
    {
      ask: true,
    }
  );
  const restoreUser = async () => {
    const user = await storage.getUser();
    if (user) setuser(user);
  };
  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  if (!permission || permission.status !== "granted") {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Permission is not granted</Text>
        <Button title="Grant permission" onPress={askForPermission} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, setuser }}>
        {user ? <ImagePicker /> : <Login />}
      </AuthContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
