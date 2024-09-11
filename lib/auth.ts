import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { fetchAPI } from "./fetch";

/**
 * トークンを安全に保存・取得するためのキャッシュ機能を提供します。
 */
export const tokenCache = {
  /**
   * 指定されたキーに紐づくトークンを取得します。
   * @param key トークンを保存するキー
   * @returns トークン文字列、またはキーが存在しない場合はnull
   */
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  /**
   * 指定されたキーにトークンを保存します。
   * @param key トークンを保存するキー
   * @param value 保存するトークン文字列
   * @returns 保存に成功した場合はPromise、失敗した場合はundefined
   */
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

/**
 * Google OAuth 認証フローを実行します。
 * @param startOAuthFlow OAuthフローを開始する関数
 * @returns 認証結果オブジェクト (success, code, message)
 */
export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    // OAuthフローを開始
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
    });

    // セッションが作成された場合
    if (createdSessionId) {
      // セッションをアクティブ化
      if (setActive) {
        await setActive({ session: createdSessionId });

        // ユーザーが新規登録された場合
        if (signUp.createdUserId) {
          // ユーザー情報をAPIに送信
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
        // ログイン成功
        return {
          success: true,
          code: "success",
          message: "Google ログインに成功しました",
        };
      }
    }

    // ログイン失敗
    return {
      success: false,
      message: "Failed to sign in with Google",
    };
  } catch (error: any) {
    // エラー発生
    return {
      success: false,
      code: error.code,
      message: error?.errors[0]?.longMessage,
    };
  }
};
