import React, {useCallback} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {CastMember, MovieListItem} from '../types/tmdb';
import {POSTER_BASE_URL} from '../api/movies';
import {Colors, FontSize, Radius, Spacing} from '../theme/tokens';
import CastCard from './CastCard';

interface CastCarouselProps {
  cast: CastMember[];
}

export const CastCarousel: React.FC<CastCarouselProps> = ({cast}) => {
  const renderItem = useCallback<ListRenderItem<CastMember>>(
    ({item}) => <CastCard member={item} />,
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
    ({item}) => {
      const percentage = Math.round(item.vote_average * 10);
      return (
        <TouchableOpacity
          style={styles.recCard}
          onPress={() => onMoviePress(item)}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.title}`}>
          {item.poster_path ? (
            <Image
              source={{uri: `${POSTER_BASE_URL}${item.poster_path}`}}
              style={styles.recPoster}
            />
          ) : (
            <View style={[styles.recPoster, styles.recPosterPlaceholder]}>
              <Text style={styles.recPosterPlaceholderText}>🎬</Text>
            </View>
          )}
          <Text style={styles.recTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.recScore}>{percentage}%</Text>
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
    width: 110,
    marginHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  recPoster: {
    width: 110,
    height: 160,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  recPosterPlaceholder: {
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recPosterPlaceholderText: {
    fontSize: 24,
  },
  recTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  recScore: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
