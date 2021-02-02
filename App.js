import { StatusBar } from "expo-status-bar";
import React, {useState, useContext} from "react";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/Home";
import Login from "./src/Login";
import AuthContext from "./src/auth/context";

export default function App() {
  const [user, setuser] = useState();
  return (
      <AuthContext.Provider value={{ user, setuser }}>
          <View style={styles.container}>
              {user ? <Home /> : <Login />}
              <StatusBar style="auto" />
          </View>
      </AuthContext.Provider>
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
