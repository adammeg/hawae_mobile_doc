import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/src/lib/auth-context";

export default function Index() {
  const { token, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/calendar" />;
}
