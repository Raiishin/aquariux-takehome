import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CastMember, MovieListItem } from '../types/tmdb';
import { POSTER_BASE_URL } from '../api/movies';
import { Colors, FontSize, Radius, Spacing } from '../theme/tokens';
import CastCard from './CastCard';

interface CastCarouselProps {
  cast: CastMember[];
}

export const CastCarousel: React.FC<CastCarouselProps> = ({ cast }) => {
  const renderItem = useCallback<ListRenderItem<CastMember>>(
    ({ item }) => <CastCard member={item} />,
    [],
  );

  const keyExtractor = useCallback((item: CastMember) => String(item.id), []);

  if (cast.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No cast information available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={cast.slice(0, 20)}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  );
};

interface RecommendedCarouselProps {
  movies: MovieListItem[];
  onMoviePress: (movie: MovieListItem) => void;
}

export const RecommendedCarousel: React.FC<RecommendedCarouselProps> = ({
  movies,
  onMoviePress,
}) => {
  const renderItem = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => {
      const percentage = Math.round(item.vote_average * 10);
      return (
        <TouchableOpacity
          style={styles.recCard}
          onPress={() => onMoviePress(item)}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.title}`}
        >
          {item.poster_path ? (
            <Image
              source={{ uri: `${POSTER_BASE_URL}${item.poster_path}` }}
              style={styles.recPoster}
            />
          ) : (
            <View style={[styles.recPoster, styles.recPosterPlaceholder]}>
              <Text style={styles.recPosterPlaceholderText}>🎬</Text>
            </View>
          )}
          <View style={styles.recMeta}>
            <Text style={styles.recTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.recScore}>{percentage}%</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [onMoviePress],
  );

  const keyExtractor = useCallback(
    (item: MovieListItem) => String(item.id),
    [],
  );

  if (movies.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No recommendations available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={movies}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  empty: {
    padding: Spacing.lg,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
  },
  recCard: {
    width: 160,
    marginHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  recPoster: {
    width: 160,
    height: 240,
  },
  recPosterPlaceholder: {
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recPosterPlaceholderText: {
    fontSize: 24,
  },
  recMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  recTitle: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recScore: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    flexShrink: 0,
  },
});
