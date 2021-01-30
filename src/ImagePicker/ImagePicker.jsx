import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import { Button } from "react-native-paper";
import CameraModule from "./CameraModule";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [camera, setShowCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "#eeee",
          width: 120,
          height: 120,
          borderRadius: 100,
          marginBottom: 8,
        }}
      >
        <Image
          source={{ uri: image }}
          style={{ width: 120, height: 120, borderRadius: 100 }}
        />
      </View>
      <Button
        style={{ width: "30%", marginTop: 16 }}
        icon="camera"
        mode="contained"
        onPress={() => {
          setShowCamera(true);
        }}
      >
        Camera
      </Button>
      {camera && (
        <CameraModule
          showModal={camera}
          setModalVisible={() => setShowCamera(false)}
          setImage={(result) => setImage(result.uri)}
        />
      )}
    </View>
  );
}
