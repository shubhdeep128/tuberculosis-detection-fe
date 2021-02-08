import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity } from "react-native";
import Home from "./src/Home";
import Login from "./src/Login";
import AuthContext from "./src/auth/context";
import ImagePicker from "./src/ImagePicker/ImagePicker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


export default function App() {
    const [user, setuser] = useState();
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
