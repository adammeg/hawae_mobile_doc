import Constants from "expo-constants";

/**
 * URL du backend HawaeMD.
 * Définir EXPO_PUBLIC_API_URL dans .env (ex. http://192.168.1.10:3000).
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:3000`;
  }

  return "http://localhost:3000";
}
