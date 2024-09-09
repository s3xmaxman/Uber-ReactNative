import React from "react";
import { View, Text } from "react-native";

const RideLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View>
      <Text>Top</Text>
      {children}
      <Text>Bottom</Text>
    </View>
  );
};

export default RideLayout;
