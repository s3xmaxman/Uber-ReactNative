import { ScrollView, View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";
const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
      Alert.alert("Error", error.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed Please try again",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* ヘッダー */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            アカウントを作成
          </Text>
        </View>

        {/* 入力フォーム */}
        <View className="p-5 ">
          <InputField
            label="名前"
            placeholder="名前を入力してください"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

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
            title="サインアップ"
            className="mt-6"
            onPress={onSignUpPress}
          />

          {/* OAuth認証 */}
          <OAuth />

          {/* ログイン画面へのリンク */}
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-5"
          >
            既にアカウントをお持ちですか？{" "}
            <Text className="text-primary-500">ログイン</Text>
          </Link>
        </View>

        {/* 認証 */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">認証</Text>
            <Text className="font-jakarta mb-5">
              {form.email}へ認証コードを送信しました
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="認証"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* 確認モーダル */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <View className="mb-5">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto"
              />
            </View>
            <Text className="text-center text-3xl font-JakartaBold">
              認証完了！
            </Text>

            <Text className="text-base text-gray-400 font-jakarta text-center mt-2">
              アカウントの認証が正常に完了しました。
            </Text>

            <CustomButton
              title="ホームへ"
              className="mt-5"
              onPress={() => {
                router.push("/(root)/(tabs)/home");
              }}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
