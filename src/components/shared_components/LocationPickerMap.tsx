import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SellDraft } from "@src/context/SellDraftContext"; 
import { TradeDraft } from "@src/context/TradeDraftContext"; 
import { useTranslation } from "react-i18next"; 
import { TFunction } from "i18next";

const DEFAULT_REGION = {
  latitude: 11.5564,
  longitude: 104.9282,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface LocationPickerMapProps {
  onConfirmLocation: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  currentDraft: SellDraft | TradeDraft;
  onUpdateDraft: (key: string, value: any) => void;
  themeColors: ReturnType<typeof useThemeColor>;
  t: TFunction<"translation", undefined>;
}

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export default function LocationPickerMap({
  onConfirmLocation,
  currentDraft,
  onUpdateDraft,
}: LocationPickerMapProps) {
  const { t } = useTranslation();
  const themeColors = useThemeColor(); 
  const mapRef = useRef<MapView>(null);

  const [hasSelectedLocation, setHasSelectedLocation] = useState(
    !!(
      currentDraft.location.latitude &&
      currentDraft.location.latitude !== DEFAULT_REGION.latitude
    ),
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [markerCoord, setMarkerCoord] = useState(currentDraft.location);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      if (!hasSelectedLocation) {
            try { 
              let currentLocation = await Location.getCurrentPositionAsync({});
              const newLocation = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              };
              onUpdateDraft("location", newLocation);
              setMarkerCoord(newLocation);
              mapRef.current?.animateToRegion(
                { ...newLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 },
                1000,
              );
              setHasSelectedLocation(true);
            } catch (error) {
              console.error("Error getting current location:", error);
            
            }
          }
        })();
      }, [currentDraft.location.latitude]); 
  const styles = getStyles(themeColors);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${markerCoord.latitude},${markerCoord.longitude}`;

  const CustomButton = ({
    title,
    onPress,
    disabled,
    style,
    textStyle,
  }: CustomButtonProps) => (
    <TouchableOpacity
      style={[styles.customButton, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText style={[styles.customButtonText, textStyle]}>
        {String(title)}
      </ThemedText>
    </TouchableOpacity>
  );

  const handleTap = (coordinate: { latitude: number; longitude: number }) => {
    setMarkerCoord(coordinate);
    onUpdateDraft("location", coordinate);
    mapRef.current?.animateToRegion(
      { ...coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      500,
    );
    setHasSelectedLocation(true);
    setIsConfirmed(false);
  };

  const handleDragEnd = (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    setMarkerCoord(coordinate);
    onUpdateDraft("location", coordinate);
    setHasSelectedLocation(true);
    setIsConfirmed(false);
  };

  return (
    <>
      <ThemedText style={styles.locationTitle}>
        {t("sellSection.Pin_Location")}
      </ThemedText>
      <View
        style={styles.mapContainer}
        onStartShouldSetResponderCapture={() => !isConfirmed}
      >
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={
            currentDraft.location.latitude
              ? { ...currentDraft.location, latitudeDelta: 0.01, longitudeDelta: 0.01 }
              : DEFAULT_REGION
          }
          onPress={(e) => !isConfirmed && handleTap(e.nativeEvent.coordinate)}
          scrollEnabled={!isConfirmed}
          zoomEnabled={!isConfirmed}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={markerCoord}
            draggable={!isConfirmed}
            onDragEnd={(e) => handleDragEnd(e.nativeEvent.coordinate)}
          />
        </MapView>
        {isConfirmed && <View style={styles.mapOverlay} />}
      </View>

      <View style={styles.buttonContainer}>
        {!isConfirmed ? (
          <CustomButton
            title={t("sellSection.Confirm_Location")}
            onPress={() => {
              onConfirmLocation(markerCoord);
              setIsConfirmed(true);
            }}
            disabled={!hasSelectedLocation}
          />
        ) : (
          <View style={styles.confirmedContainer}>
            <TouchableOpacity onPress={() => Linking.openURL(mapUrl)}>
              <ThemedText style={styles.linkText}>
                {t("sellSection.Open_on_Google_Maps")}
              </ThemedText>
            </TouchableOpacity>
            <CustomButton
              title={t("sellSection.Change_Location")}
              onPress={() => setIsConfirmed(false)}
              style={styles.changeButton}
              textStyle={styles.changeButtonText}
            />
          </View>
        )}
      </View>
    </>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColor>) =>
  StyleSheet.create({
    locationTitle: { marginTop: 20, fontSize: 16, marginBottom: 10 },
    mapContainer: {
      height: 200,
      borderRadius: 10,
      marginBottom: 15,
      overflow: "hidden",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mapOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    buttonContainer: {
      marginBottom: 20,
    },
    customButton: {
      backgroundColor: themeColors.tint,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    disabledButton: {
      backgroundColor: themeColors.border,
    },
    customButtonText: {
      color: themeColors.primaryButtonText,
      fontSize: 16,
      fontWeight: "bold",
    },
    confirmedContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: themeColors.background,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    linkText: {
      color: themeColors.tint,
      textDecorationLine: "underline",
      fontSize: 14,
    },
    changeButton: {
      backgroundColor: themeColors.primary,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    changeButtonText: {
      fontSize: 14,
      color: themeColors.primaryButtonText,
      fontWeight: "bold",
    },
  });
