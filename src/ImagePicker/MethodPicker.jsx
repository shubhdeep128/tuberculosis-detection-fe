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
      <Picker.Item label="Canny" value="cannyUrl" />
      <Picker.Item label="SobelX" value="sobelXUrl" />
      <Picker.Item label="SobelY" value="sobelYUrl" />
      <Picker.Item label="Laplacian" value="laplacianUrl" />
      <Picker.Item label="Otsu" value="otsuUrl" />
    </Picker>
  );
};

export default MethodPicker;
