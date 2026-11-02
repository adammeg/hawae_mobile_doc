import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme/colors";

export function LoadingScreen({ label = "Chargement…" }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.teal} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
    gap: 12,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
});
