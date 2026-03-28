# MovieDB — Implementation Assumptions

1. TMDB Read Access Token does not provide an authenticated user session, so the Watchlist username is a hardcoded demo value ("Movie Fan") and "Member since" is derived from the oldest item's addedAt timestamp.
2. Search is scoped to the selected category (client-side filter on fetched page) because TMDB's /search/movie endpoint has no category parameter.
3. Content certification (PG13 etc.) is fetched from /movie/{id}/release_dates — US theatrical (type 3) prioritised, fallback to first available, default "NR".
4. "Load More" shows 5 results at a time from the already-fetched page (not true multi-page pagination).
5. Watchlist is stored in AsyncStorage locally, not synced to TMDB server-side watchlist.
6. Sort direction on Watchlist screen is local state (not persisted), reset when screen is revisited.
7. Tapping a Recommended movie uses navigation.push() to allow back-navigation through the recommendation chain.
8. Bottom tab icons use Unicode characters to avoid react-native-vector-icons native linking setup.
9. "Member since" on the Watchlist screen uses the earliest addedAt timestamp in the local watchlist.
10. The Details screen runs 4 parallel queries (details, credits, cert, recommendations) for optimal load time.
