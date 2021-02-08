import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import React, { useState, useContext } from "react";
import * as Google from "expo-google-app-auth";
import { IOS_CLIENT_ID, AND_CLIENT_ID } from "@env";
import AuthContext from "./auth/context";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: "whitesmoke",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        margin: 5,
        borderRadius: 30,
    },
    spinnerTextStyle: {
        color: "#FFF",
    },
});


export default function Login() {
    const authContext = useContext(AuthContext);
    const [loginFailed, setloginFailed] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signInWithGoogleAsync() {
        
        try {
            const result = await Google.logInAsync({
                iosClientId: IOS_CLIENT_ID,
                androidClientId: AND_CLIENT_ID,
                scopes: ["profile", "email"],
            });

            if (result.type === "success") {
                //console.log(result);
                return result;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    const signInWithGoogle = async () => {
        setLoading(true);
        const result = await signInWithGoogleAsync();
        setLoading(false);
        //console.log(result);
        if (result.cancelled || result.error) {
            return setloginFailed(true);
        }
        authContext.setuser(result.user.name);
        return setloginFailed(false);
    };

    return (
        <View style={styles.container}>
            {loginFailed ? <Text>Please Log in again</Text> : null}
            <Button
                icon={
                    <Icon
                        name="google"
                        type="font-awesome-5"
                        size={20}
                        color="white"
                    />
                }
                title="  Login with Google"
                buttonStyle={styles.button}
                onPress={() => signInWithGoogle()}
            />
            {loading && (
                <ActivityIndicator
                    animating={loading}
                    size="large"
                    color="black"
                    style={styles.loading}
                />
            )}
        </View>
    );
    
}
