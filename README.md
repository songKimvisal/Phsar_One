# PhsarOne

A mobile marketplace application built with Expo and React Native for buying, selling, and trading items. The app includes listing management, trade offers, real-time chat, notifications, subscriptions, multilingual support, AI-assisted search, and image moderation.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App Locally](#running-the-app-locally)
- [AI Service](#ai-service)
- [Supabase](#supabase)
- [Android APK Build](#android-apk-build)
- [Scripts](#scripts)
- [Important Notes](#important-notes)
- [Known Constraints](#known-constraints)

---

## Overview

PhsarOne is designed as a marketplace experience with two major transaction flows:

- **Standard listings** — direct buying and selling
- **Trade listings** — item-for-item exchange via trade offers

The app supports account creation and authentication, creating and managing listings, seller profiles and subscription plans, in-app messaging for regular and trade conversations, location selection and map preview using OpenStreetMap, AI-powered semantic search and recommendations, basic dangerous-item moderation for listing text and images, and English and Khmer localization.

---

## Core Features

### Marketplace
- Create listings with title, description, images, structured details, price, discount, contact information, and location
- Save drafts and publish later
- Edit active listings and relist expired ones
- View categories, filters, product details, seller information, and safety guidance

### Trade Flow
- Create public trade listings
- Send trade offers using an existing trade item
- Create a private trade item directly from the offer flow
- Open or continue trade chat after an offer is sent

### Messaging
- Regular chat and trade chat
- Send text, images, location, and voice messages
- Conversation mute/block actions
- Notifications for messages and trade offers

### Notifications
- In-app notifications list
- Unread badge support
- Read one, read all, and clear all

### Subscriptions
- Multiple plans with listing and boost limits
- Subscription purchase flow via Stripe
- Manage, cancel, and resume subscription status in-app

### Search and Moderation
- Semantic search using embeddings
- Recommendation endpoint
- Dangerous text moderation for listings
- Dangerous-item image moderation endpoint

### Localization and Theming
- English and Khmer locale files
- Light and dark theme support

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Mobile App** | Expo SDK 54, React Native 0.81, React 19, Expo Router, TypeScript |
| **Auth** | Clerk (authentication, sessions, password recovery) |
| **Backend** | Supabase (Postgres, Storage, Realtime, row-level access) |
| **Payments** | Stripe, `@stripe/stripe-react-native` |
| **Maps** | OpenStreetMap, Expo Location, react-native-webview |
| **Media** | Expo Image Picker, Expo Image Manipulator, Expo File System, Expo Audio / AV, Expo Notifications |
| **AI Service** | FastAPI, Uvicorn, sentence-transformers, PyTorch CPU build, Pillow |

---

## Project Structure

```
.
├── app.json
├── eas.json
├── package.json
├── src/
│   ├── app/                    # Expo Router screens
│   ├── components/             # UI components
│   ├── constants/              # App constants and static config
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom hooks
│   ├── i18n/                   # Localization setup and locale files
│   ├── lib/                    # Shared app libraries
│   ├── types/                  # TypeScript types
│   └── utils/                  # Helpers and utilities
├── supabase/
│   └── migrations/             # Database migrations and policies
└── tools/
    └── ai_search/              # Python AI service
```

---

## Prerequisites

Install the following before running the project:

- Node.js 20+ or 22+
- npm
- Android Studio
- Android SDK
- Java 17
- Expo CLI / `npx expo`

For Android local builds on Windows, make sure these are configured:

- `JAVA_HOME`
- `ANDROID_HOME`
- Path entries for Java and Android SDK tools

Verify with:

```bash
java --version
adb --version
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
EXPO_PUBLIC_AI_SEARCH_API_URL=...
```

> **Notes:**
> - `EXPO_PUBLIC_AI_SEARCH_API_URL` should point to the hosted AI service for physical devices and APK builds.
> - Do not put the Supabase service-role key into the mobile app.

---

## Installation

```bash
npm install
```

Keep `.npmrc` in place to ensure consistent dependency resolution across local and cloud installs.

---

## Running the App Locally

Start Metro:

```bash
npx expo start
```

Run on Android (recommended for development):

```bash
npx expo run:android
```

This is the preferred workflow while making UI or logic changes. Use EAS only when you need a final shareable APK.

Other useful commands:

```bash
npx tsc --noEmit --pretty false   # Type-check
npx eslint src --ext .ts,.tsx     # Lint
npx expo-doctor                   # Diagnose Expo config issues
```

---

## AI Service

The AI service lives in `tools/ai_search` and provides:

| Endpoint | Description |
|---|---|
| `GET /health` | Service health check |
| `GET /semantic-search` | Embedding-based semantic search |
| `GET /recommendations` | Item recommendations |
| `POST /moderate-image` | Dangerous-item image moderation |

### Local setup

```bash
bash tools/ai_search/start_local_ai.sh
```

- Android emulator → `10.0.2.2`
- iOS simulator → `localhost`
- Physical devices → use a hosted URL

### Railway deployment

Recommended configuration:

| Setting | Value |
|---|---|
| Root Directory | `tools/ai_search` |
| Builder | Railpack |
| Runtime | Python 3.11 via `runtime.txt` |
| Start command | `uvicorn api_server:app --host 0.0.0.0 --port $PORT` |

After deployment, generate a public Railway domain, confirm `/health` responds, then set:

```env
EXPO_PUBLIC_AI_SEARCH_API_URL=https://YOUR-SERVICE.up.railway.app
```

The AI service also requires:

```env
EXPO_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Supabase

This project depends on Supabase for product and trade data, conversations and messages, notifications, storage buckets, subscription state, and moderation-related data.

Apply migrations:

```bash
npx supabase db push
```

Schema-driven features in this repo include chat media bucket, notifications policies, storage policies, and marketplace and trade tables.

---

## Android APK Build

### Local development build

```bash
npx expo run:android
```

### EAS preview APK

```bash
eas build -p android --profile preview
```

`eas.json` uses `distribution: internal` and `android.buildType: apk` for the preview profile.

### EAS environment variables

Add these to the `preview` and `production` EAS environments before building:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_AI_SEARCH_API_URL`

### Pre-release device testing

Before final APK generation, test on a physical Android device:

- Keyboard behavior in regular chat and trade chat
- Image upload
- Location sharing
- Create/edit listing
- Trade offer flow
- Notifications
- AI search

---

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start Metro bundler |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in browser |
| `npm run lint` | Lint the codebase |

---

## Important Notes

**Image moderation** — Listing image moderation depends on the AI service. If the service is unavailable or under memory pressure, behavior falls back to app-side logic. Dangerous text moderation is a separate, independent flow.

**Maps** — The app uses OpenStreetMap-based flows instead of Google Maps SDK. This is intentional for APK-friendly operation without a Google Maps API key.

**Stripe** — Integrated in test/development mode unless production credentials and backend behavior are fully configured.

---

## Known Constraints

- The AI image moderation endpoint is heavier than the semantic-search endpoint and may require more reliable hosting resources for production-grade behavior.
- Some lint warnings remain in the codebase. TypeScript compilation errors and lint errors should be cleared before release.
- Stripe, the hosted AI service, and Supabase project credentials are all environment-configured rather than hardcoded in app code.

---

## License

This project is proprietary and all rights are reserved. See [LICENSE](./LICENSE).
