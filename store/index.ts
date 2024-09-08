import { create } from "zustand";

import { DriverStore, LocationStore, MarkerData } from "@/types/type";

/**
 * ロケーション情報を管理するZustandストア
 */
export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  /**
   * ユーザーの位置情報を設定する
   * @param latitude - 緯度
   * @param longitude - 経度
   * @param address - 住所
   */
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // 選択されたドライバーがいる場合、クリアする
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();

    if (selectedDriver) {
      clearSelectedDriver();
    }
  },

  /**
   * 目的地の位置情報を設定する
   * @param latitude - 緯度
   * @param longitude - 経度
   * @param address - 住所
   */
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // 選択されたドライバーがいる場合、クリアする
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
}));

/**
 * ドライバー情報を管理するZustandストア
 */
export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,

  /**
   * 選択されたドライバーを設定する
   * @param driverId - ドライバーID
   */
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),

  /**
   * ドライバーリストを設定する
   * @param drivers - ドライバーの配列
   */
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),

  /**
   * 選択されたドライバーをクリアする
   */
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));
