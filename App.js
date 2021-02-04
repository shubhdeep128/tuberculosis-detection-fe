import { StatusBar } from "expo-status-bar";
import React, {useState, useContext} from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import Home from "./src/Home";
import Login from "./src/Login";
import AuthContext from "./src/auth/context";
import ImagePicker from "./src/ImagePicker/ImagePicker";

export default function App() {
  const [user, setuser] = useState();
  return (
      <AuthContext.Provider value={{ user, setuser }}>
          <SafeAreaView style={styles.container}>
              {user ? <ImagePicker /> : <Login />}
              <StatusBar style="auto" />
          </SafeAreaView>
      </AuthContext.Provider>
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
