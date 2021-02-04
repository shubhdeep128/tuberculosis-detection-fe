import { View, Text, Button } from "react-native";
import React, { useState, useContext } from "react";
import * as Google from "expo-google-app-auth";
import { IOS_CLIENT_ID, AND_CLIENT_ID } from "@env";
import AuthContext from "./auth/context";

export default function Login() {
    const authContext = useContext(AuthContext);
    const [loginFailed, setloginFailed] = useState(false);

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
        const result = await signInWithGoogleAsync();
        //console.log(result);
        if (result.cancelled || result.error) {
            return setloginFailed(true);
        }
        authContext.setuser(result.user.name);
        return setloginFailed(false);
    };

    return (
        <View>
            {loginFailed ? <Text>Please Log in again</Text> : null}
            <Button
                title="Login with Google"
                onPress={() => signInWithGoogle()}
            />
        </View>
    );
}
