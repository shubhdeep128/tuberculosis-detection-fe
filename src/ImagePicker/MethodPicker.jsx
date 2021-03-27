import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
export const MethodPicker = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <Picker
      selectedValue={selectedMethod}
      onValueChange={(itemValue, itemindex) => {
        setSelectedMethod(itemValue);
      }}
      style={{ height: 50, width: 200 }}
    >
      <Picker.Item label="Canny" value="cannyURLs" />
      <Picker.Item label="SobelX" value="sobelXURLs" />
      <Picker.Item label="SobelY" value="sobelYURLs" />
      <Picker.Item label="Laplacian" value="laplacianURLs" />
    </Picker>
  );
};

export default MethodPicker;
