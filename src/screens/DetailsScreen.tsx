import React, {useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import UserScoreCircle from '../components/UserScoreCircle';
import {CastCarousel, RecommendedCarousel} from '../components/MovieCarousel';
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieCertification,
  fetchRecommendedMovies,
  POSTER_BASE_URL,
} from '../api/movies';
import {useWatchlistStore} from '../store/useWatchlistStore';
import {formatRuntime} from '../utils/sorting';
import type {MovieListItem, WatchlistMovie} from '../types/tmdb';
import {Colors, FontSize, Radius, Spacing} from '../theme/tokens';
import type {HomeStackParamList} from '../navigation/HomeStack';

type DetailsNavigationProp = StackNavigationProp<HomeStackParamList, 'Details'>;
type DetailsRouteProp = RouteProp<HomeStackParamList, 'Details'>;

interface DetailsScreenProps {
  navigation: DetailsNavigationProp;
  route: DetailsRouteProp;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({navigation, route}) => {
  const {movieId, movieTitle} = route.params;
  const {addToWatchlist, removeFromWatchlist, isInWatchlist} = useWatchlistStore();
  const inWatchlist = isInWatchlist(movieId);

  const detailsQuery = useQuery({
    queryKey: ['movie-details', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    staleTime: 10 * 60 * 1000,
  });

  const creditsQuery = useQuery({
    queryKey: ['movie-credits', movieId],
    queryFn: () => fetchMovieCredits(movieId),
    staleTime: 10 * 60 * 1000,
  });

  const certQuery = useQuery({
    queryKey: ['movie-cert', movieId],
    queryFn: () => fetchMovieCertification(movieId),
    staleTime: 10 * 60 * 1000,
  });

  const recQuery = useQuery({
    queryKey: ['movie-recommended', movieId],
    queryFn: () => fetchRecommendedMovies(movieId),
    staleTime: 10 * 60 * 1000,
  });

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleWatchlistToggle = useCallback(() => {
    if (!detailsQuery.data) return;
    const movie = detailsQuery.data;
    if (inWatchlist) {
      removeFromWatchlist(movieId);
    } else {
      const watchlistMovie: WatchlistMovie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genres.map(g => g.id),
        original_language: movie.original_language,
        popularity: movie.popularity,
        addedAt: Date.now(),
      };
      addToWatchlist(watchlistMovie);
    }
  }, [detailsQuery.data, inWatchlist, movieId, addToWatchlist, removeFromWatchlist]);

  const handleRecommendedPress = useCallback(
    (movie: MovieListItem) => {
      navigation.push('Details', {movieId: movie.id, movieTitle: movie.title});
    },
    [navigation],
  );

  const isMainLoading = detailsQuery.isLoading || creditsQuery.isLoading;
  const isMainError = detailsQuery.isError || creditsQuery.isError;
  const handleRetry = useCallback(() => {
    detailsQuery.refetch();
    creditsQuery.refetch();
    certQuery.refetch();
    recQuery.refetch();
  }, [detailsQuery, creditsQuery, certQuery, recQuery]);

  if (isMainLoading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <LoadingSpinner />
      </View>
    );
  }

  if (isMainError || !detailsQuery.data) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <ErrorMessage
          message="Failed to load movie details."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  const movie = detailsQuery.data;
  const credits = creditsQuery.data;
  const cert = certQuery.data ?? 'NR';
  const recommended = recQuery.data ?? [];

  const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const releaseFormatted = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'TBA';
  const runtime = formatRuntime(movie.runtime);
  const genreNames = movie.genres.map(g => g.name).join(', ');
  const languageName =
    movie.spoken_languages.find(
      l => l.iso_639_1 === movie.original_language,
    )?.english_name ?? movie.original_language;

  const directors =
    credits?.crew
      .filter(c => c.job === 'Director')
      .slice(0, 2)
      .map(c => ({name: c.name, role: 'Director'})) ?? [];
  const writers =
    credits?.crew
      .filter(c => c.department === 'Writing')
      .slice(0, Math.max(0, 3 - directors.length))
      .map(c => ({name: c.name, role: c.job})) ?? [];
  const keyCreatives = [...directors, ...writers].slice(0, 3);

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView bounces={false}>
        {/* ── Upper block: cyan — title row + poster + metadata ── */}
        <View style={styles.upperBlock}>
          {/* Row 1: back + title (centered) */}
          <View style={styles.titleRow}>
            <TouchableOpacity
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={styles.backBtn}>
              <Text style={styles.backChevron}>‹</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.movieTitle}>{movieTitle}</Text>
              {year ? (
                <Text style={styles.movieYear}> ({year})</Text>
              ) : null}
            </View>
            <View style={styles.backBtn} />
          </View>

          {/* Row 2: poster + metadata */}
          <View style={styles.posterMetaRow}>
            {movie.poster_path ? (
              <Image
                source={{uri: `${POSTER_BASE_URL}${movie.poster_path}`}}
                style={styles.poster}
              />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]}>
                <Text style={styles.posterPlaceholderText}>🎬</Text>
              </View>
            )}
            <View style={styles.metaBlock}>
              <View style={styles.certBadge}>
                <Text style={styles.certText}>{cert}</Text>
              </View>
              <Text style={styles.metaText}>
                {releaseFormatted} (SG){'  '}•{'  '}{runtime}
              </Text>
              <Text style={styles.metaText}>{genreNames}</Text>
              <Text style={styles.metaText}>
                <Text style={styles.metaLabel}>Status: </Text>
                {movie.status}
              </Text>
              <Text style={styles.metaText}>
                <Text style={styles.metaLabel}>Original Language: </Text>
                {languageName}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Lower block: dark navy — score + tagline + overview + button ── */}
        <View style={styles.lowerBlock}>
          {/* Row 3: score + key creatives (left-aligned) */}
          <View style={styles.scoreCreativesRow}>
            <UserScoreCircle score={movie.vote_average} />
            <View style={styles.creativesBlock}>
              {keyCreatives.map((c, i) => (
                <View key={i} style={styles.creativeItem}>
                  <Text style={styles.creativeName}>{c.name}</Text>
                  <Text style={styles.creativeRole}>{c.role}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tagline */}
          {movie.tagline ? (
            <Text style={styles.tagline}>{movie.tagline}</Text>
          ) : null}

          {/* Overview */}
          <Text style={styles.overviewHeading}>Overview</Text>
          <Text style={styles.overviewText}>{movie.overview}</Text>

          {/* Watchlist button — narrow, outlined */}
          <TouchableOpacity
            style={[styles.watchlistBtn, inWatchlist && styles.watchlistBtnActive]}
            onPress={handleWatchlistToggle}
            accessibilityRole="button"
            accessibilityLabel={
              inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'
            }>
            <Text style={styles.watchlistBtnText}>
              🔖 {inWatchlist ? 'Remove from Watchlist' : 'Add To Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cast + Recommendations */}
        <View style={styles.whiteSection}>
          <Text style={styles.sectionHeading}>Top Billed Cast</Text>
          <CastCarousel cast={credits?.cast ?? []} />
          <Text style={styles.sectionHeading}>Recommendations</Text>
          <RecommendedCarousel
            movies={recommended}
            onMoviePress={handleRecommendedPress}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ── Upper block (cyan) ─────────────────────────────────────────────────────
  upperBlock: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backBtn: {
    marginRight: Spacing.md,
    padding: 4,
  },
  backChevron: {
    fontSize: 28,
    color: Colors.textOnDark,
    fontWeight: '300',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textOnDark,
    textAlign: 'center',
  },
  movieYear: {
    fontSize: FontSize.xl,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  posterMetaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: Radius.md,
  },
  posterPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterPlaceholderText: {
    fontSize: 32,
  },
  metaBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  certBadge: {
    borderWidth: 1,
    borderColor: Colors.textOnDark,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  certText: {
    color: Colors.textOnDark,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  metaText: {
    color: Colors.textOnDark,
    fontSize: FontSize.base,
    lineHeight: 20,
  },
  metaLabel: {
    fontWeight: '700',
  },
  // ── Lower block (dark navy) ────────────────────────────────────────────────
  lowerBlock: {
    backgroundColor: Colors.primaryDark,
    padding: Spacing.lg,
  },
  scoreCreativesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  creativesBlock: {
    flex: 1,
    gap: Spacing.sm,
  },
  creativeItem: {
    gap: 2,
  },
  creativeName: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  creativeRole: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  tagline: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.base,
    marginBottom: Spacing.md,
  },
  overviewHeading: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginBottom: Spacing.sm,
  },
  overviewText: {
    fontSize: FontSize.lg,
    color: Colors.textOnDark,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  watchlistBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.textOnDark,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchlistBtnActive: {
    opacity: 0.75,
  },
  watchlistBtnText: {
    color: Colors.textOnDark,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  // ── White section ──────────────────────────────────────────────────────────
  whiteSection: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
  },
  sectionHeading: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});

export default DetailsScreen;
