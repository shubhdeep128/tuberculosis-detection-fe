import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { serverUrl } from "../../constants";
import Base64 from "Base64";
import axios from "axios";

export default function ProcessImage({ route, navigation }) {
  const resultImages = route.params;
  const imageUrl = resultImages["imageUrl"];
  const encoded = Base64.btoa(imageUrl);

  return (
    <WebView
      source={{
        uri: serverUrl + "imageCrop/" + encoded,
      }}
      style={{ marginTop: 0 }}
      onMessage={async (event) => {
        // console.log(JSON.parse(event.nativeEvent.data));
        const res = await axios.post(`${serverUrl}record/update`, {
          _id: resultImages._id,
          points: JSON.parse(event.nativeEvent.data),
        });
        // console.log(res);
        navigation.navigate("Result", {
          data: route.params,
          points: event.nativeEvent.data,
        });
      }}
    />
  );
}
