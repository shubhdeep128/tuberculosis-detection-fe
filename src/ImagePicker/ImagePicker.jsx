import React, { useState, useEffect } from "react";
import { View, Image, Platform, Button } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import uploadImage from "./uploadImage";
export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [resultImages, setResultImages] = useState(null);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          galleryStatus,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { cameraStatus } = await Camera.requestPermissionsAsync();
        if (galleryStatus !== "granted" || cameraStatus !== "granted") {
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
      uploadImage(result.uri, setResultImages);
      console.log(resultImages);
    }
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from Gallery" onPress={pickImageGallery} />
      <Button title="Pick an image from Camera " onPress={pickImageCamera} />

      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      {resultImages &&
        resultImages.cannyURLs.map((uri, idx) => {
          return (
            <Image
              source={{
                uri,
              }}
              key={idx}
              style={{ width: 200, height: 200 }}
            />
          );
        })}
    </View>
  );
}
