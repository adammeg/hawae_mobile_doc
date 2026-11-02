import { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { RdvCard } from "@/components/ui";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ApiError, fetchCalendar, type CalendarResponse } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import { colors } from "@/src/theme/colors";

export default function CalendarScreen() {
  const { token, doctor } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (offset: number, silent = false) => {
      if (!token) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetchCalendar(token, offset);
        setData(res);
      } catch (e) {
        setError(
          e instanceof ApiError ? e.message : "Impossible de charger l'agenda.",
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
      void load(weekOffset);
    }, [load, weekOffset]),
  );

  if (loading && !data) return <LoadingScreen label="Agenda…" />;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(weekOffset, true);
          }}
          tintColor={colors.teal}
        />
      }
    >
      <Text style={styles.greeting}>Bonjour, {doctor?.name ?? "Docteur"}</Text>
      <Text style={styles.weekTitle}>{data?.weekTitle ?? "Semaine"}</Text>

      <View style={styles.navRow}>
        <Text
          style={styles.navBtn}
          onPress={() => setWeekOffset((w) => w - 1)}
        >
          ← Sem. préc.
        </Text>
        <Text style={styles.navBtn} onPress={() => setWeekOffset(0)}>
          Aujourd'hui
        </Text>
        <Text
          style={styles.navBtn}
          onPress={() => setWeekOffset((w) => w + 1)}
        >
          Sem. suiv. →
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aujourd'hui</Text>
        {data?.todayRdvs.length ? (
          data.todayRdvs.map((r) => <RdvCard key={r.id} rdv={r} />)
        ) : (
          <Text style={styles.empty}>Aucun rendez-vous aujourd'hui.</Text>
        )}
      </View>

      {data?.days.map((day) => (
        <View key={day.date} style={styles.section}>
          <Text style={[styles.sectionTitle, day.isToday && styles.todayTitle]}>
            {day.label}
            {day.isToday ? " · Aujourd'hui" : ""}
          </Text>
          {day.rdv.length ? (
            day.rdv.map((r) => <RdvCard key={r.id} rdv={r} />)
          ) : (
            <Text style={styles.empty}>Libre</Text>
          )}
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prochains RDV</Text>
        {data?.upcoming.length ? (
          data.upcoming.map((r) => <RdvCard key={`up-${r.id}`} rdv={r} />)
        ) : (
          <Text style={styles.empty}>Aucun RDV à venir.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  greeting: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  weekTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 8,
  },
  navBtn: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.teal,
  },
  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 8,
  },
  todayTitle: { color: colors.teal },
  empty: {
    fontSize: 13,
    color: colors.muted,
    fontStyle: "italic",
  },
  error: {
    color: colors.red,
    fontWeight: "600",
    marginVertical: 8,
  },
});
