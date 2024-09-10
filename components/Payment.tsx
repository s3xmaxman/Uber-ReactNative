import { View, Text } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";

const Payment = () => {
  const openPaymentSheet = () => {};
  return (
    <>
      <CustomButton
        title="予約を確定"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
