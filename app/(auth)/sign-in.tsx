import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useCallback } from "react";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { Link, router } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      Alert.alert("Error", error.errors[0].longMessage);
    }
  }, [form, isLoaded]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* ヘッダー */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            ログイン
          </Text>
        </View>

        {/* 入力フォーム */}
        <View className="p-5 ">
          <InputField
            label="メールアドレス"
            placeholder="メールアドレスを入力してください"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="パスワード"
            placeholder="パスワードを入力してください"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="ログイン"
            className="mt-6"
            onPress={onSignInPress}
          />

          {/* OAuth認証 */}
          <OAuth />

          {/* ログイン画面へのリンク */}
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            アカウントを持っていない場合{" "}
            <Text className="text-primary-500">こちら</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
