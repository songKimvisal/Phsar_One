import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { ChatCircleIcon, PhoneIcon } from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ProductActionButtonsProps {
  onCallSeller: () => void;
  onChatSeller: () => void;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  onCallSeller,
  onChatSeller,
}) => {
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  const styles = getStyles(themeColors);

  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.callButton} onPress={onCallSeller}>
        <PhoneIcon size={20} color={themeColors.background} />
        <ThemedText style={styles.callButtonText}>
          {t("productDetail.callSeller")}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.chatButton,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.text + "20",
          },
        ]}
        onPress={onChatSeller}
      >
        <ChatCircleIcon size={20} color={themeColors.text} />
        <ThemedText style={styles.chatButtonText}>
          {t("productDetail.chatSeller")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (themeColors: ReturnType<typeof useThemeColor>) =>
  StyleSheet.create({
    actionButtons: {
      flexDirection: "row",
      gap: 6,
      marginBottom: 24,
      height: 44,
      paddingHorizontal: 16,
    },
    callButton: {
      flex: 1,
      backgroundColor: themeColors.tint,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 99,
      gap: 8,
    },
    callButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    chatButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 99,
      gap: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    chatButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: themeColors.text,
    },
  });

export default ProductActionButtons;
