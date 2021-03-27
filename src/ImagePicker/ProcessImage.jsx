import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { serverUrl } from "../../constants";
import Base64 from "Base64";

export default function ProcessImage({ route, navigation }) {
  const resultImages = route.params;
  const imageUrl = resultImages["URLs"][0];
  const encoded = Base64.btoa(imageUrl);

  return (
    <WebView
      source={{
        uri: serverUrl + "imageCrop/" + encoded,
      }}
      style={{ marginTop: 0 }}
      onMessage={(event) => {
        navigation.navigate("Result", route.params);
      }}
    />
  );
}
