import { useState, useEffect, useCallback } from "react";

/**
 * fetchAPI関数は、指定されたURLとオプションを使用してAPIを呼び出します。
 * @param url - APIのURL
 * @param options - リクエストオプション
 * @returns レスポンスのJSONデータ
 * @throws HTTPエラーの場合、エラーをスローします
 */
export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error", error);
    throw error;
  }
};

/**
 * useFetchフックは、指定されたURLとオプションを使用してAPIを呼び出し、
 * データ、ローディング状態、エラー状態を管理します。
 * @param url - APIのURL
 * @param options - リクエストオプション
 * @returns データ、ローディング状態、エラー状態、再フェッチ関数を含むオブジェクト
 */
export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchData関数は、APIを呼び出し、データを取得します。
   * ローディング状態とエラー状態を適切に更新します。
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
