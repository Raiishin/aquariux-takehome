import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { MovieListItem } from '../types/tmdb';
import { POSTER_BASE_URL } from '../api/movies';
import { Colors, FontSize, Radius, Spacing } from '../theme/tokens';
import { formatReleaseDate } from '../utils/sorting';

interface MovieCardProps {
  movie: MovieListItem;
  onPress: (movie: MovieListItem) => void;
  onRemove?: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = React.memo(
  ({ movie, onPress, onRemove }) => {
    const handlePress = useCallback(() => {
      onPress(movie);
    }, [movie, onPress]);

    const handleRemove = useCallback(() => {
      onRemove?.(movie.id);
    }, [movie.id, onRemove]);

    return (
      <Animated.View entering={FadeInDown.duration(350).springify()}>
        <TouchableOpacity
          style={styles.card}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${movie.title}`}
        >
          {movie.poster_path ? (
            <Image
              source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
              style={styles.poster}
            />
          ) : (
            <View style={[styles.poster, styles.posterPlaceholder]}>
              <Text style={styles.posterPlaceholderText}>🎬</Text>
            </View>
          )}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.date}>
              {formatReleaseDate(movie.release_date)}
            </Text>
            <Text style={styles.overview} numberOfLines={3}>
              {movie.overview}
            </Text>
          </View>
          {onRemove && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={handleRemove}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${movie.title} from watchlist`}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

MovieCard.displayName = 'MovieCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  poster: {
    width: 84,
    height: 126,
  },
  posterPlaceholder: {
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterPlaceholderText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    paddingRight: Spacing.xl,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  overview: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  removeBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 14,
    color: Colors.removeButton,
    fontWeight: '700',
  },
});

export default MovieCard;
