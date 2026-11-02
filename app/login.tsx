import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/ui";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ApiError } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import { colors } from "@/src/theme/colors";
import { getApiBaseUrl } from "@/src/lib/config";

export default function LoginScreen() {
  const { token, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <LoadingScreen label="Initialisation…" />;
  if (token) return <Redirect href="/(tabs)/calendar" />;

  async function onSubmit() {
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.code === "invalid_credentials"
            ? "Email ou mot de passe incorrect."
            : e.message
          : "Connexion impossible. Vérifiez le réseau et l'URL API.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.hero}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>H</Text>
              </View>
              <Text style={styles.title}>HawaeMD</Text>
              <Text style={styles.subtitle}>Mobile · Médecin</Text>
              <Text style={styles.lead}>
                Consultez votre agenda et vos statistiques cabinet depuis votre
                téléphone.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="medecin@cabinet.fr"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton
                label="Se connecter"
                onPress={onSubmit}
                loading={busy}
              />
            </View>

            <Text style={styles.apiHint}>API : {getApiBaseUrl()}</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  hero: { alignItems: "center", marginBottom: 28 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.muted,
  },
  lead: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkMid,
    maxWidth: 320,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 8,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.inkMid,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.cream,
  },
  error: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  apiHint: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 11,
    color: colors.muted,
  },
});
