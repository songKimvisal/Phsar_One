import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Header() {
  const themesColors = useThemeColor();

  return (
    <View
      style={[styles.container, { backgroundColor: themesColors.background }]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@src/assets/icons/Wordmark.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },
  logoIcon: {
    width: undefined,
    height: "100%",
    aspectRatio: 4,
  },
});
