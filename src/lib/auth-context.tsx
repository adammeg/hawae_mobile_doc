import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchMe,
  login as apiLogin,
  type DoctorProfile,
} from "./api";

const TOKEN_KEY = "hawae_access_token";
const DOCTOR_KEY = "hawae_doctor_profile";

type AuthState = {
  token: string | null;
  doctor: DoctorProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedDoctor = await SecureStore.getItemAsync(DOCTOR_KEY);
        if (cancelled) return;
        if (storedToken) {
          setToken(storedToken);
          if (storedDoctor) {
            setDoctor(JSON.parse(storedDoctor) as DoctorProfile);
          }
          const me = await fetchMe(storedToken).catch(() => null);
          if (cancelled) return;
          if (me) {
            setDoctor(me);
            await SecureStore.setItemAsync(DOCTOR_KEY, JSON.stringify(me));
          } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(DOCTOR_KEY);
            setToken(null);
            setDoctor(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { accessToken, doctor: doc } = await apiLogin(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(DOCTOR_KEY, JSON.stringify(doc));
    setToken(accessToken);
    setDoctor(doc);
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(DOCTOR_KEY);
    setToken(null);
    setDoctor(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const me = await fetchMe(token);
    if (me) {
      setDoctor(me);
      await SecureStore.setItemAsync(DOCTOR_KEY, JSON.stringify(me));
    }
  }, [token]);

  const value = useMemo(
    () => ({ token, doctor, loading, signIn, signOut, refreshProfile }),
    [token, doctor, loading, signIn, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
