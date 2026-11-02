/** HawaeMD brand palette (aligned with web app). */
export const colors = {
  teal: "#0A5C5C",
  tealDeep: "#083F3F",
  tealMid: "#0D7272",
  tealLight: "#1A9A9A",
  tealPale: "#E8F5F5",
  gold: "#C9A84C",
  blush: "#F4D6DA",
  cream: "#F7F5F0",
  creamDark: "#EEE9E2",
  ink: "#1A2E2E",
  inkMid: "#3D5C5C",
  muted: "#7A9A9A",
  border: "#D4E8E8",
  white: "#FFFFFF",
  green: "#16A34A",
  red: "#DC2626",
  orange: "#D97706",
  blue: "#3b82f6",
};

export const rdvTypeColors: Record<string, string> = {
  consultation: "#3b82f6",
  grossesse: "#10b981",
  echo: "#f59e0b",
  chirurgie: "#ec4899",
  bilan: "#8b5cf6",
  urgence: "#ef4444",
};

export const rdvTypeLabels: Record<string, string> = {
  consultation: "Consultation",
  grossesse: "Suivi grossesse",
  echo: "Échographie",
  chirurgie: "Chirurgie",
  bilan: "Bilan",
  urgence: "Urgence",
};

export const rdvStatutLabels: Record<string, string> = {
  confirme: "Confirmé",
  attente: "En attente",
  annule: "Annulé",
  non_joint: "Non joint",
  a_rappeler: "À rappeler",
};
