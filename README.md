# MovieDB

A React Native mobile app for browsing movies, viewing detailed information, and managing a personal watchlist — powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api).

---

## Table of Contents

- [Features](#features)
- [Screens](#screens)
- [Architecture & Logic Flows](#architecture--logic-flows)
- [Libraries Used](#libraries-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## Features

### Core
- **Browse movies** by category: Now Playing, Upcoming, Popular
- **Sort** movies by rating, alphabetical order, or release date (persisted across app restarts)
- **Search** within the selected category (client-side keyword filtering)
- **Movie detail view** with poster, metadata, user score, cast, and recommendations
- **Watchlist** — add and remove movies, sort and filter, persisted locally

### UX Polish
- **Skeleton loading cards** — animated shimmer placeholders while data loads, keeping controls interactive
- **Pull-to-refresh** — swipe down on the movie list to refetch
- **Haptic feedback** — vibration pattern on add/remove from watchlist
- **Animated card entrance** — each movie card fades and slides in using `react-native-reanimated`
- **Persistent preferences** — category, sort order, and watchlist sort survive app restarts via AsyncStorage
- **Offline-resilient** — React Query caches responses; stale data is served while revalidating

---

## Screens

### Home Screen
- Dropdown to switch between **Now Playing**, **Upcoming**, and **Popular** categories
- Sort dropdown (**By alphabetical order**, **By rating**, **By release date**) — shows "Sort By" placeholder until explicitly selected; selection is persisted
- Text search input — filters the current category's results client-side
- **Load More** button for pagination (5 cards per page)
- Skeleton cards during initial load; spinner during pull-to-refresh

### Details Screen
Two-tone header layout (dark navy / cyan):
- Movie poster, title, year, content certification badge, release date, runtime, genres, status, original language
- Circular user score with colour-coded arc (green ≥ 70%, yellow ≥ 40%, red < 40%)
- Key creatives (directors and writers, up to 3 entries)
- Tagline and full overview
- **Add To Watchlist / Remove from Watchlist** button with haptic feedback
- Horizontally scrollable **Top Billed Cast** carousel (portrait cards with shadow)
- Horizontally scrollable **Recommendations** carousel — tap to navigate to that movie's detail page

### Watchlist Screen
- User profile block with avatar, display name, and "Member since" date derived from the oldest saved movie's timestamp
- Sort dropdown (**By rating**, **By alphabetical order**, **By release date**) and ascending/descending toggle — both persisted
- Swipe-accessible remove button (✕) on each movie card
- Empty state when no movies are saved
- Tap any card to navigate to its Details screen

---

## Architecture & Logic Flows

### Data Flow

```
TMDB REST API
    │
    ▼
Axios Client (Bearer token auth)
    │
    ▼
React Query (caching, stale-while-revalidate, retry)
    │
    ├──▶ Screen components (HomeScreen, DetailsScreen)
    │
Zustand stores ◀──▶ AsyncStorage (persistence)
    │
    └──▶ WatchlistScreen, DetailsScreen (watchlist state)
```

### State Management

Two Zustand stores, both backed by AsyncStorage:

**`usePreferencesStore`**
| Field | Default | Persisted |
|---|---|---|
| `category` | `now_playing` | Yes |
| `sortOrder` | `release_date` | Yes |
| `sortDirection` | `desc` | Yes |
| `sortExplicitlySet` | `false` | Yes |

`sortExplicitlySet` tracks whether the user has actively chosen a sort order. The dropdown shows "Sort By" on first launch and only shows the selected value after an explicit selection.

**`useWatchlistStore`**
| Field | Default | Persisted |
|---|---|---|
| `watchlist` | `[]` | Yes (`@moviedb_watchlist`) |
| `sortOrder` | `rating` | Yes (`@moviedb_watchlist_sort`) |
| `sortDirection` | `desc` | Yes (`@moviedb_watchlist_sort`) |

Both stores expose a `hydrate()` action called once in `App.tsx` via a `StoreHydrator` component before any screen renders.

### Navigation

```
RootNavigator (Bottom Tabs)
├── HomeTab
│   └── HomeStack (Stack)
│       ├── Home (HomeScreen)
│       └── Details (DetailsScreen)  ← params: { movieId, movieTitle }
└── WatchlistTab
    └── WatchlistScreen
```

Tab icons are custom SVG paths (no native icon library required). The Details screen is inside the HomeStack so it can be reached from both the home list and the recommendations carousel using `navigation.push()`, enabling back-navigation through a recommendation chain.

### API Layer

All requests go through a shared Axios instance (`src/api/client.ts`) configured with:
- Base URL: `https://api.themoviedb.org/3`
- Auth: `Authorization: Bearer <TMDB_READ_ACCESS_TOKEN>`

| Function | Endpoint | Usage |
|---|---|---|
| `fetchMoviesByCategory` | `GET /movie/{category}` | Home screen list |
| `searchMoviesInCategory` | `GET /movie/{category}` + client filter | Search |
| `fetchMovieDetails` | `GET /movie/{id}` | Details screen |
| `fetchMovieCredits` | `GET /movie/{id}/credits` | Cast & crew |
| `fetchMovieCertification` | `GET /movie/{id}/release_dates` | Rating badge |
| `fetchRecommendedMovies` | `GET /movie/{id}/recommendations` | Recommendations carousel |

The Details screen fires all four movie queries in parallel for optimal load time.

**Certification logic:** prioritises US theatrical releases (type 3), falls back to the first available certification in any region, defaults to `"NR"` if none found.

### Caching Strategy

| Query | Stale Time |
|---|---|
| Movie list (home) | 5 minutes |
| Movie details | 10 minutes |
| Credits | 10 minutes |
| Certification | 10 minutes |
| Recommendations | 10 minutes |

React Query retries failed requests up to 2 times with exponential backoff (1 s → 2 s → 4 s, capped at 30 s).

### Skeleton Loading

`SkeletonCard` uses `react-native-reanimated`'s `withRepeat` + `withTiming` to pulse opacity between 1.0 and 0.35 at 750 ms intervals. Five skeleton cards are rendered in `ListEmptyComponent` while `isLoading` is true, keeping the controls (dropdowns, search) fully interactive above the list.

---

## Libraries Used

| Library | Version | Purpose |
|---|---|---|
| `react-native` | 0.84.1 | Core framework |
| `react` | 19.2.3 | UI library |
| `@react-navigation/native` | 6.1.18 | Navigation container |
| `@react-navigation/bottom-tabs` | 6.6.1 | Tab bar navigation |
| `@react-navigation/stack` | 6.4.1 | Stack navigation |
| `react-native-screens` | 4.24.0 | Native screen optimisation |
| `react-native-safe-area-context` | 5.7.0 | Safe area handling |
| `react-native-gesture-handler` | 2.30.1 | Gesture support for navigation |
| `@tanstack/react-query` | 5.95.2 | Server state, caching, retry |
| `axios` | 1.14.0 | HTTP client |
| `zustand` | 5.0.12 | Client state management |
| `@react-native-async-storage/async-storage` | 2.2.0 | Local persistence |
| `react-native-reanimated` | 4.3.0 | Animations (skeleton shimmer, card entrance) |
| `react-native-svg` | 15.15.4 | SVG icons and score arc |
| `react-native-dropdown-picker` | 5.4.6 | Category and sort dropdowns |
| `react-native-dotenv` | 3.4.11 | Environment variable loading |
| `react-native-worklets` | 0.8.1 | Reanimated worklets runtime |
| `typescript` | 5.8.3 | Type safety |

---

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with auth
│   └── movies.ts          # All TMDB API functions
├── components/
│   ├── AppHeader.tsx       # "THE MOVIE DB" logo header
│   ├── CastCard.tsx        # Portrait cast member card
│   ├── EmptyState.tsx      # Empty list placeholder
│   ├── ErrorMessage.tsx    # Error with retry button
│   ├── LoadingSpinner.tsx  # Activity indicator
│   ├── MovieCard.tsx       # Animated horizontal movie list card
│   ├── MovieCarousel.tsx   # CastCarousel + RecommendedCarousel
│   ├── SkeletonCard.tsx    # Pulsing loading placeholder
│   └── UserScoreCircle.tsx # SVG circular progress score
├── navigation/
│   ├── HomeStack.tsx       # Home + Details stack
│   └── RootNavigator.tsx   # Bottom tab navigator
├── screens/
│   ├── DetailsScreen.tsx   # Full movie detail view
│   ├── HomeScreen.tsx      # Browse, search, sort movies
│   └── WatchlistScreen.tsx # Personal saved movies list
├── store/
│   ├── usePreferencesStore.ts  # Category, sort prefs + persistence
│   └── useWatchlistStore.ts    # Watchlist + sort + persistence
├── theme/
│   └── tokens.ts           # Colors, spacing, font sizes, radii
├── types/
│   ├── env.d.ts            # react-native-dotenv type declaration
│   └── tmdb.ts             # All TMDB TypeScript types
└── utils/
    └── sorting.ts          # sortMovies<T>, formatRuntime, formatReleaseDate
```

---

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- React Native development environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))
- A TMDB account and Read Access Token ([get one here](https://www.themoviedb.org/settings/api))

### Installation

```sh
# 1. Clone the repo and install JS dependencies
npm install

# 2. Install iOS native dependencies
cd ios && pod install && cd ..

# 3. Create your environment file
cp .env.example .env
# Then add your TMDB token to .env
```

### Running the App

```sh
# Start Metro bundler
npm start

# iOS (separate terminal)
npm run ios

# Android (separate terminal)
npm run android
```

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
```

The token is loaded at build time via `react-native-dotenv` and injected as a Bearer token on every API request. Never commit your `.env` file.

---

## Design Decisions & Assumptions

| # | Decision | Rationale |
|---|---|---|
| 1 | **Hardcoded user profile** | TMDB Read Access Token doesn't provide an authenticated user session; username and avatar are static placeholders |
| 2 | **Client-side search** | TMDB's `/search/movie` has no category filter; fetching the category list then filtering locally keeps results scoped correctly |
| 3 | **Load More pagination** | Slices the already-fetched page of results (5 at a time) rather than fetching additional API pages — keeps the UX simple for the current data size |
| 4 | **Local-only watchlist** | Stored in AsyncStorage only; not synced to TMDB's server-side watchlist API (which requires full OAuth) |
| 5 | **SVG icons via react-native-svg** | Avoids native linking setup required by vector-icon libraries; SVG paths taken directly from Figma |
| 6 | **`navigation.push()` for recommendations** | Allows navigating deeper into a recommendation chain while preserving the back stack |
| 7 | **4 parallel queries on Details screen** | Details, credits, certification, and recommendations are fetched simultaneously to minimise perceived load time |
| 8 | **"Sort By" placeholder** | The `sortExplicitlySet` flag distinguishes a user-chosen sort from the default, so the placeholder is shown on first launch but the persisted choice is shown on subsequent launches |
