import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { formatDuration } from "@src/utils/chatUtils";
import { Audio } from "expo-av";
import { MicrophoneIcon, StopIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  url: string;
  duration?: number;
  isMe: boolean;
}

export default function VoicePlayer({ url, duration, isMe }: Props) {
  const themeColors = useThemeColor();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (sound && typeof sound.unloadAsync === "function") {
        // call but don't await in cleanup
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  const toggle = async () => {
    try {
      if (playing && sound) {
        await sound.pauseAsync();
        setPlaying(false);
        return;
      }

      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !status.didJustFinish) {
          await sound.playAsync();
          setPlaying(true);
          return;
        } else {
          await sound.unloadAsync();
          setSound(null);
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound: s } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
      );
      setSound(s);
      setPlaying(true);
      s.setOnPlaybackStatusUpdate((st: any) => {
        if (st.isLoaded) {
          setProgress(st.positionMillis / (st.durationMillis || 1));
          if (st.didJustFinish) {
            setPlaying(false);
            setProgress(0);
            s.unloadAsync();
            setSound(null);
          }
        }
      });
    } catch (e) {
      console.error("Voice error:", e);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 190,
      }}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isMe
            ? "rgba(255,255,255,0.25)"
            : themeColors.primary,
        }}
      >
        {playing ? (
          <StopIcon size={13} color="#fff" weight="fill" />
        ) : (
          <MicrophoneIcon size={13} color="#fff" weight="fill" />
        )}
      </View>

      <View
        style={{
          flex: 1,
          height: 3,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: isMe ? "rgba(255,255,255,0.3)" : themeColors.border,
        }}
      >
        <View
          style={{
            height: 3,
            borderRadius: 2,
            width: `${progress * 100}%`,
            backgroundColor: isMe ? "#fff" : themeColors.primary,
          }}
        />
      </View>

      <ThemedText
        style={{
          color: isMe ? "#fff" : themeColors.tabIconDefault,
          fontSize: 12,
          minWidth: 34,
        }}
      >
        {formatDuration(duration || 0)}
      </ThemedText>
    </TouchableOpacity>
  );
}
