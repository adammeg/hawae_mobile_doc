# HawaeMD Mobile (React Native / Expo)

Application mobile **lecture seule** pour les médecins : **agenda** et **statistiques cabinet**.

## Prérequis

- Node.js 20+
- Backend HawaeMD (`hawae-md`) en cours d'exécution
- Expo Go sur téléphone, ou émulateur Android / iOS

## Configuration

1. Copier `.env.example` vers `.env`
2. Définir `EXPO_PUBLIC_API_URL` :
   - Émulateur Android : `http://10.0.2.2:3000`
   - Appareil physique : `http://<IP-LAN-PC>:3000`
3. Dans le backend (`hawae-md/.env`), activer CORS mobile :

```env
MOBILE_CORS_ORIGIN=*
```

Ou lister les origines Expo séparées par des virgules.

## Lancer

```bash
cd hawae-md-mobile
npm install
npm start
```

Puis scanner le QR code avec Expo Go, ou :

```bash
npm run android
npm run ios
```

## Fonctionnalités

| Écran | Contenu |
|-------|---------|
| **Agenda** | Semaine lun–sam, RDV du jour, navigation semaine, prochains RDV |
| **Statistiques** | KPIs, activité mensuelle, spécialités, tranches d'âge, RDV par type |

## API utilisées

- `POST /api/auth/login` → JWT (`accessToken`)
- `GET /api/auth/me` → profil médecin
- `GET /api/mobile/calendar?weekOffset=0`
- `GET /api/mobile/stats?period=6&specialty=all`

Authentification : header `Authorization: Bearer <token>`.

## Stack

- Expo SDK 56 + Expo Router
- React Native 0.85
- expo-secure-store (token JWT)
