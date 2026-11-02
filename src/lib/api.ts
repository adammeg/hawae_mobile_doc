import { getApiBaseUrl } from "./config";

export type DoctorProfile = {
  id: string;
  email: string;
  name: string;
  clinicId?: string | null;
  role?: string;
};

export type RdvItem = {
  id: string;
  patient: string;
  tel: string;
  date: string;
  heure: string;
  duree: number;
  type: string;
  statut: string;
  notes: string;
};

export type CalendarResponse = {
  ok: boolean;
  today: string;
  weekTitle: string;
  weekStart: string;
  weekEnd: string;
  days: {
    date: string;
    label: string;
    isToday: boolean;
    rdv: RdvItem[];
  }[];
  todayRdvs: RdvItem[];
  upcoming: RdvItem[];
};

export type StatsResponse = {
  ok: boolean;
  period: number;
  specialty: string;
  stats: {
    filteredTotal: number;
    consultationsTotal: number;
    avgCompleteness: number;
    updatedLast7Days: number;
    updatedLast30Days: number;
    hawaeExchanges: number;
    rappelsPending: number;
    rdv: {
      total: number;
      upcomingWeek: number;
      byType: { type: string; count: number; label: string }[];
      byStatut: { statut: string; count: number; label: string }[];
    };
    ageBands: { label: string; count: number }[];
    obstRisks: Record<string, number>;
    infertility: Record<string, number>;
  };
  activity: {
    label: string;
    month: string;
    dossiers: number;
    consultations: number;
  }[];
  specialtyChart: { label: string; value: number; key: string }[];
  consultationsMonthly: { month: string; label: string; count: number }[];
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!res.ok) {
    throw new ApiError(
      data.error ?? res.statusText ?? "Erreur réseau",
      res.status,
      data.error,
    );
  }

  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<{ accessToken: string; doctor: DoctorProfile }> {
  const data = await request<{
    ok: boolean;
    accessToken: string;
    doctor: DoctorProfile;
  }>("/api/auth/login", null, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { accessToken: data.accessToken, doctor: data.doctor };
}

export async function fetchMe(token: string): Promise<DoctorProfile | null> {
  const data = await request<{ doctor: DoctorProfile | null }>(
    "/api/auth/me",
    token,
  );
  return data.doctor;
}

export async function fetchCalendar(
  token: string,
  weekOffset = 0,
): Promise<CalendarResponse> {
  return request<CalendarResponse>(
    `/api/mobile/calendar?weekOffset=${weekOffset}`,
    token,
  );
}

export async function fetchStats(
  token: string,
  period = 6,
  specialty = "all",
): Promise<StatsResponse> {
  return request<StatsResponse>(
    `/api/mobile/stats?period=${period}&specialty=${specialty}`,
    token,
  );
}
