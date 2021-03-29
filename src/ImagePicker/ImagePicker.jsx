import React, { useState, useContext } from "react";
import { ActivityIndicator, View, Image, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import uploadImage from "./uploadImage";
import AuthContext from "../auth/context";
import { MethodPicker } from "./MethodPicker";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import storage from "../auth/storage";
import { WebView } from "react-native-webview";
import Base64 from "Base64";
import { serverUrl } from "../../constants";

import ProcessImage from "./ProcessImage";

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
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const ImageWrapper = ({ uri }) => {
  const [loading, setLoading] = useState(true);
  return (
    <View style={{ width: 300, height: 300, marginVertical: 20 }}>
      <Image
        source={{ uri: uri }}
        style={{
          width: 300,
          height: 300,
          borderRadius: 10,
        }}
        resizeMode="contain"
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
      console.log(response.data);
      setResultImages(response.data);
      console.log("resultImages " + JSON.stringify(resultImages));

      navigation.navigate("Process", response.data);

      // navigation.navigate("Result", response.data);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Welcome {user} !</Text>
      <View style={{ marginVertical: 10 }}>
        <Button
          type="clear"
          title="Log Out"
          onPress={() => {
            setuser(null);
            storage.removeToken();
          }}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Button
          icon={
            <Icon name="collections" type="material" size={20} color="white" />
          }
          title=" Pick an image from Gallery"
          onPress={pickImageGallery}
          buttonStyle={styles.button}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Button
          icon={<Icon name="camera" type="material" size={20} color="white" />}
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
  const resultImages = route.params.data;
  const [selectedMethod, setSelectedMethod] = useState("cannyUrl");
  const imageUrl = resultImages["imageUrl"];
  const encoded = Base64.btoa(imageUrl);
  const id = resultImages._id;
  const [original, setOriginal] = useState(false);

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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <MethodPicker
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
          <ImageWrapper uri={resultImages[selectedMethod]} />
          {selectedMethod === "cannyUrl" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.titleText}>
                Area : {resultImages["cannyArea"]} pixels
              </Text>
              <Text style={styles.titleText}>
                Perimeter : {resultImages["cannyPerimeter"]} pixels
              </Text>
            </View>
          )}
          {selectedMethod === "laplacianUrl" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.titleText}>
                Area : {resultImages["laplacianArea"]} pixels
              </Text>
              <Text style={styles.titleText}>
                Perimeter : {resultImages["laplacianPerimeter"]} pixels
              </Text>
            </View>
          )}
          {selectedMethod === "sobelXUrl" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.titleText}>
                Area : {resultImages["sobelXArea"]} pixels
              </Text>
              <Text style={styles.titleText}>
                Perimeter : {resultImages["sobelXPerimeter"]} pixels
              </Text>
            </View>
          )}
          {selectedMethod === "sobelYUrl" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.titleText}>
                Area : {resultImages["sobelYArea"]} pixels
              </Text>
              <Text style={styles.titleText}>
                Perimeter : {resultImages["sobelYPerimeter"]} pixels
              </Text>
            </View>
          )}
          {selectedMethod === "otsuUrl" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.titleText}>
                Area : {resultImages["otsuArea"]} pixels
              </Text>
              <Text style={styles.titleText}>
                Perimeter : {resultImages["otsuPerimeter"]} pixels
              </Text>
            </View>
          )}
        </View>
      )
    );
  };

  // return (
  //   <WebView
  //     source={{
  //       uri: serverUrl + "imageView/" + encoded + "/" + id,
  //     }}
  //     style={{ marginTop: 0 }}
  //   />
  // );

  return original ? (
    <View style={{ flex: 1 }}>
      <WebView
        onMessage={(event) => {
          setOriginal(false);
        }}
        source={{
          uri: serverUrl + "imageView/" + encoded + "/" + id,
        }}
        style={{ flex: 1 }}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <View>
        <ResultSection
          resultImages={resultImages}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
        />
      </View>
      <Button
        onPress={() => setOriginal(true)}
        title="Click to see the original image"
      />
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
        <Stack.Screen name="Process" component={ProcessImage} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
