import { ThemedText } from "@src/components/ThemedText";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const DEFAULT_REGION = {
  latitude: 11.5564,
  longitude: 104.9282,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface LocationPickerMapProps {
  themeColors: ReturnType<typeof useThemeColor>;
  t: (key: string) => string;
}

export default function LocationPickerMap({
  themeColors,
  t,
}: LocationPickerMapProps) {
  const { draft, updateDraft } = useSellDraft();
  const [mapRegion, setMapRegion] = useState(
    draft.location.latitude && draft.location.longitude
      ? {
          latitude: draft.location.latitude,
          longitude: draft.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : DEFAULT_REGION,
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      if (
        draft.location.latitude === DEFAULT_REGION.latitude &&
        draft.location.longitude === DEFAULT_REGION.longitude
      ) {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        updateDraft("location", newLocation);
        setMapRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        setMapRegion({
          latitude: draft.location.latitude,
          longitude: draft.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  return (
    <>
      <ThemedText style={styles.locationTitle}>
        {t("sellSection.Pin_Location")}
      </ThemedText>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
        onPress={(e) => {
          const newLocation = {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          };
          updateDraft("location", newLocation);
          setMapRegion({
            ...newLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }}
      >
        <Marker coordinate={draft.location} />
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  locationTitle: { marginTop: 20, fontSize: 16, marginBottom: 10 },
  map: { height: 200, borderRadius: 10, marginBottom: 20 },
});
