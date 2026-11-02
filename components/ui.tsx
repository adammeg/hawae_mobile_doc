import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, rdvStatutLabels, rdvTypeColors, rdvTypeLabels } from "@/src/theme/colors";
import type { RdvItem } from "@/src/lib/api";

export function RdvCard({ rdv }: { rdv: RdvItem }) {
  const typeColor = rdvTypeColors[rdv.type] ?? colors.teal;
  return (
    <View style={styles.card}>
      <View style={[styles.timeBadge, { backgroundColor: typeColor }]}>
        <Text style={styles.timeText}>{rdv.heure}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.patient}>{rdv.patient || "Sans nom"}</Text>
        <Text style={styles.meta}>
          {rdvTypeLabels[rdv.type] ?? rdv.type} · {rdv.duree} min
        </Text>
        <Text style={styles.statut}>
          {rdvStatutLabels[rdv.statut] ?? rdv.statut}
        </Text>
        {rdv.notes ? <Text style={styles.notes}>{rdv.notes}</Text> : null}
      </View>
    </View>
  );
}

export function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      {sub ? <Text style={styles.kpiSub}>{sub}</Text> : null}
    </View>
  );
}

export function BarRow({
  label,
  value,
  max,
  color = colors.teal,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 0;
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "ghost";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.btn,
        variant === "primary" ? styles.btnPrimary : styles.btnGhost,
        pressed && { opacity: 0.85 },
        loading && { opacity: 0.6 },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          variant === "primary" ? styles.btnTextPrimary : styles.btnTextGhost,
        ]}
      >
        {loading ? "…" : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  timeBadge: {
    minWidth: 54,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  timeText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 13,
  },
  body: { flex: 1 },
  patient: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.inkMid,
  },
  statut: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: colors.teal,
    textTransform: "uppercase",
  },
  notes: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
  },
  kpi: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.teal,
  },
  kpiLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: colors.inkMid,
  },
  kpiSub: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  barRow: { marginBottom: 12 },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  barLabel: { fontSize: 12, color: colors.inkMid, fontWeight: "600" },
  barValue: { fontSize: 12, color: colors.teal, fontWeight: "800" },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.tealPale,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 999 },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPrimary: { backgroundColor: colors.teal },
  btnGhost: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnText: { fontSize: 15, fontWeight: "700" },
  btnTextPrimary: { color: colors.white },
  btnTextGhost: { color: colors.teal },
});
