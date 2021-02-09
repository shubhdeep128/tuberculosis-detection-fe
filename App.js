import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Button,
    TouchableOpacity,
} from "react-native";
import Home from "./src/Home";
import Login from "./src/Login";
import AuthContext from "./src/auth/context";
import ImagePicker from "./src/ImagePicker/ImagePicker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Permissions from "expo-permissions";

export default function App() {
    const [user, setuser] = useState();
    const [permission, askForPermission] = Permissions.usePermissions(
        [Permissions.CAMERA, Permissions.MEDIA_LIBRARY],
        {
            ask: true,
        }
    );

    if (!permission || permission.status !== "granted") {
        return (
            <View>
                <Text>Permission is not granted</Text>
                <Button title="Grant permission" onPress={askForPermission} />
            </View>
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
