import { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { BarRow, KpiCard } from "@/components/ui";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ApiError, fetchStats, type StatsResponse } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import { colors } from "@/src/theme/colors";

const PERIODS = [
  { value: 3, label: "3 mois" },
  { value: 6, label: "6 mois" },
  { value: 12, label: "12 mois" },
  { value: 0, label: "Tout" },
] as const;

export default function StatsScreen() {
  const { token } = useAuth();
  const [period, setPeriod] = useState<number>(6);
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (p: number, silent = false) => {
      if (!token) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetchStats(token, p, "all");
        setData(res);
      } catch (e) {
        setError(
          e instanceof ApiError ? e.message : "Impossible de charger les stats.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useFocusEffect(
    useCallback(() => {
      void load(period);
    }, [load, period]),
  );

  const maxActivity = useMemo(() => {
    if (!data?.activity.length) return 1;
    return Math.max(
      ...data.activity.map((a) => Math.max(a.dossiers, a.consultations)),
      1,
    );
  }, [data]);

  const maxSpec = useMemo(() => {
    if (!data?.specialtyChart.length) return 1;
    return Math.max(...data.specialtyChart.map((s) => s.value), 1);
  }, [data]);

  if (loading && !data) return <LoadingScreen label="Statistiques…" />;

  const s = data?.stats;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(period, true);
          }}
          tintColor={colors.teal}
        />
      }
    >
      <Text style={styles.lead}>Vue cabinet · lecture seule</Text>

      <View style={styles.chips}>
        {PERIODS.map((p) => (
          <Text
            key={p.value}
            onPress={() => setPeriod(p.value)}
            style={[styles.chip, period === p.value && styles.chipActive]}
          >
            {p.label}
          </Text>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.kpiGrid}>
        <KpiCard label="Patientes" value={s?.filteredTotal ?? 0} />
        <KpiCard label="Consultations" value={s?.consultationsTotal ?? 0} />
        <KpiCard
          label="Complétude moy."
          value={`${s?.avgCompleteness ?? 0}%`}
        />
        <KpiCard label="RDV semaine" value={s?.rdv.upcomingWeek ?? 0} />
        <KpiCard label="Rappels" value={s?.rappelsPending ?? 0} />
        <KpiCard label="Échanges Hawae" value={s?.hawaeExchanges ?? 0} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activité mensuelle</Text>
        {data?.activity.length ? (
          data.activity.map((row) => (
            <View key={row.month} style={styles.activityBlock}>
              <Text style={styles.monthLabel}>{row.label}</Text>
              <BarRow
                label="Dossiers mis à jour"
                value={row.dossiers}
                max={maxActivity}
                color={colors.teal}
              />
              <BarRow
                label="Consultations"
                value={row.consultations}
                max={maxActivity}
                color={colors.gold}
              />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Pas encore de données.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Répartition spécialités</Text>
        {data?.specialtyChart.length ? (
          data.specialtyChart.map((row) => (
            <BarRow
              key={row.key}
              label={row.label}
              value={row.value}
              max={maxSpec}
            />
          ))
        ) : (
          <Text style={styles.empty}>Pas encore de dossiers.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tranches d'âge</Text>
        {s?.ageBands.map((row) => (
          <BarRow
            key={row.label}
            label={row.label}
            value={row.count}
            max={Math.max(...(s.ageBands.map((b) => b.count) || [1]), 1)}
            color={colors.tealMid}
          />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>RDV par type</Text>
        {s?.rdv.byType.map((row) => (
          <BarRow
            key={row.type}
            label={row.label}
            value={row.count}
            max={Math.max(...s.rdv.byType.map((t) => t.count), 1)}
            color={colors.blue}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  lead: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "600",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 12,
    fontWeight: "700",
    color: colors.inkMid,
    overflow: "hidden",
  },
  chipActive: {
    backgroundColor: colors.tealPale,
    borderColor: colors.teal,
    color: colors.teal,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  card: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 10,
  },
  activityBlock: { marginBottom: 8 },
  monthLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.teal,
    marginBottom: 4,
  },
  empty: { color: colors.muted, fontStyle: "italic", fontSize: 13 },
  error: {
    color: colors.red,
    fontWeight: "600",
    marginVertical: 8,
  },
});
