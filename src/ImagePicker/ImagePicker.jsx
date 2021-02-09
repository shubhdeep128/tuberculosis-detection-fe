import React, { useState, useContext } from "react";
import {
    ActivityIndicator,
    View,
    Image,
    Text,
    StyleSheet,
} from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import uploadImage from "./uploadImage";
import AuthContext from "../auth/context";
import { MethodPicker } from "./MethodPicker";
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

const ImageWrapper = ({ uri }) => {
    const [loading, setLoading] = useState(true);
    return (
        <View style={{ width: 200, height: 200, marginVertical: 20 }}>
            <Image
                source={{ uri: uri }}
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                }}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => {
                    setLoading(false);
                }}
            />
            {loading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#000000" />
                </View>
            )}
        </View>
    );
};

function Welcome({ navigation }) {
    const { user, setuser } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [resultImages, setResultImages] = useState(null);
    const [loading, setLoading] = useState(false);

    // const [
    //     permission,
    //     askPermission,
    //     getPermission,
    // ] = Permissions.usePermissions(
    //     [Permissions.CAMERA, Permissions.MEDIA_LIBRARY],
    //     { ask: true }
    // );
    // useEffect(() => {
    //     (async () => {
    //         try {
    //             if (Platform.OS !== "web") {
    //                 if (!permission || permission.status !== "granted") {
                        
    //                     askPermission();
    //                 }
    //             }
    //         } catch (e) {
    //             console.log(e);
    //             console.log(permission);
    //         }

    //     })();
    // }, []);

    const pickImageGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        uploadImageHelper(result);
    };
    const pickImageCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        uploadImageHelper(result);
    };

    async function uploadImageHelper(result) {
        //console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setResultImages("empty");
            //setResultImages(await uploadImage(result.uri));
            setLoading(true);
            let response = await uploadImage(result.uri);
            setLoading(false);
            //console.log(response);
            setResultImages(response.data);
            //console.log("resultImages " + JSON.stringify(resultImages));

            navigation.navigate("Result", response.data);
        }
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20 }}>Welcome {user} !</Text>
            <View style={{ marginVertical: 10 }}>
                <Button
                    type="clear"
                    title="Log Out"
                    onPress={() => setuser(null)}
                />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Button
                    icon={
                        <Icon
                            name="collections"
                            type="material"
                            size={20}
                            color="white"
                        />
                    }
                    title=" Pick an image from Gallery"
                    onPress={pickImageGallery}
                    buttonStyle={styles.button}
                />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Button
                    icon={
                        <Icon
                            name="camera"
                            type="material"
                            size={20}
                            color="white"
                        />
                    }
                    title=" Capture an image from Camera"
                    onPress={pickImageCamera}
                    buttonStyle={styles.button}
                />
            </View>
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
function Result({ route }) {
    //console.log(route.params);
    const resultImages = route.params;
    const [selectedMethod, setSelectedMethod] = useState("cannyURLs");

    const ResultSection = ({
        // resultImages,
        selectedMethod,
        setSelectedMethod,
    }) => {
        if (resultImages === "empty")
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#000000" />
                </View>
            );
        return (
            resultImages && (
                <View>
                    <MethodPicker
                        selectedMethod={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                    />
                    <ImageWrapper uri={resultImages[selectedMethod][0]} />
                </View>
            )
        );
    };

    return (
        <View style={styles.container}>
            {resultImages && <ImageWrapper uri={resultImages["URLs"][0]} />}
            <View>
                <ResultSection
                    resultImages={resultImages}
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                />
            </View>
        </View>
    );
}

export default function ImagePickerExample() {
    

    const Stack = createStackNavigator();
    // const StackNavigator = () => {
    //     return ();

    // };

    return (
        
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Result" component={Result} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
