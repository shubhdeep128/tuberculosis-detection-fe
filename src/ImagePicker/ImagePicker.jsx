import React, { useState, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  View,
  Image,
  Platform,
  Text,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import uploadImage from "./uploadImage";
import AuthContext from "../auth/context";
import { MethodPicker } from "./MethodPicker";

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
    justifyContent: "center",
    alignItems: "center",
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

const ResultSection = ({ resultImages, selectedMethod, setSelectedMethod }) => {
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

export default function ImagePickerExample() {
  const { user, setuser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [resultImages, setResultImages] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("cannyURLs");

  const [
    permission,
    askPermission,
    getPermission,
  ] = Permissions.usePermissions(
    [Permissions.CAMERA, Permissions.MEDIA_LIBRARY],
    { ask: true }
  );
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        if (permission["status"] !== "granted") {
          alert(
            "Sorry, we need camera and gallery permissions to make this work!"
          );
        }
      }
    })();
  }, []);

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
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setResultImages("empty");
      await uploadImage(result.uri, setResultImages);
      console.log("resultImages " + resultImages);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Welcome {user} !</Text>
      <View style={{ marginVertical: 10 }}>
        <Button type="clear" title="Log Out" onPress={() => setuser(null)} />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Button title="Pick an image from Gallery" onPress={pickImageGallery} />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Button
          title="Capture an image from Camera"
          onPress={pickImageCamera}
        />
      </View>

      {image && <ImageWrapper uri={image} />}
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
