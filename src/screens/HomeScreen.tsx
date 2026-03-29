import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ChevronRight = () => <Text style={chevronStyle}>{'›'}</Text>;
const ChevronDown = () => <Text style={chevronStyle}>{'⌄'}</Text>;
const chevronStyle = {
  fontSize: 22,
  fontWeight: '700' as const,
  color: '#111827',
};
import { useQuery } from '@tanstack/react-query';
import DropDownPicker from 'react-native-dropdown-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import AppHeader from '../components/AppHeader';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { fetchMoviesByCategory, searchMoviesInCategory } from '../api/movies';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { sortMovies } from '../utils/sorting';
import type { MovieCategory, MovieListItem, SortOrder } from '../types/tmdb';
import { Colors, FontSize, Radius, Spacing } from '../theme/tokens';
import type { HomeStackParamList } from '../navigation/HomeStack';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const CATEGORIES: { label: string; value: MovieCategory }[] = [
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Popular', value: 'popular' },
];

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'By alphabetical order', value: 'alphabetical' },
  { label: 'By rating', value: 'rating' },
  { label: 'By release date', value: 'release_date' },
];

const ITEMS_PER_PAGE = 5;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    category,
    sortOrder,
    sortDirection,
    sortExplicitlySet,
    isHydrated,
    setCategory,
    setSortOrder,
  } = usePreferencesStore();

  const [searchInput, setSearchInput] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortDisplayValue, setSortDisplayValue] = useState<SortOrder | null>(
    null,
  );

  useEffect(() => {
    if (isHydrated && sortExplicitlySet) {
      setSortDisplayValue(sortOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['movies', category, activeKeyword],
    queryFn: () =>
      activeKeyword
        ? searchMoviesInCategory(category, activeKeyword)
        : fetchMoviesByCategory(category),
    staleTime: 5 * 60 * 1000,
  });

  const sortedMovies = useMemo(
    () => sortMovies(data?.results ?? [], sortOrder, sortDirection),
    [data?.results, sortOrder, sortDirection],
  );

  const visibleMovies = useMemo(
    () => sortedMovies.slice(0, visibleCount),
    [sortedMovies, visibleCount],
  );

  const hasMore = visibleCount < sortedMovies.length;

  const handleMoviePress = useCallback(
    (movie: MovieListItem) => {
      navigation.navigate('Details', {
        movieId: movie.id,
        movieTitle: movie.title,
      });
    },
    [navigation],
  );

  const handleSearch = useCallback(() => {
    setActiveKeyword(searchInput);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchInput]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setVisibleCount(ITEMS_PER_PAGE);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleCategoryChange = useCallback(
    (value: MovieCategory | null) => {
      if (value) {
        setCategory(value);
        setVisibleCount(ITEMS_PER_PAGE);
      }
    },
    [setCategory],
  );

  const handleSortChange = useCallback(
    (value: SortOrder | null) => {
      if (value) {
        setSortDisplayValue(value);
        setSortOrder(value);
      }
    },
    [setSortOrder],
  );

  const handleCategoryOpen = useCallback(() => setSortOpen(false), []);
  const handleSortOpen = useCallback(() => setCategoryOpen(false), []);

  const renderItem = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => <MovieCard movie={item} onPress={handleMoviePress} />,
    [handleMoviePress],
  );

  const keyExtractor = useCallback(
    (item: MovieListItem) => String(item.id),
    [],
  );

  const ListFooter = useMemo(() => {
    if (!hasMore) return null;
    return (
      <TouchableOpacity
        style={styles.loadMoreBtn}
        onPress={handleLoadMore}
        accessibilityRole="button"
        accessibilityLabel="Load more movies"
      >
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  }, [hasMore, handleLoadMore]);

  const ListEmpty = useMemo(() => {
    if (isLoading) {
      return (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </>
      );
    }
    if (isError) return null;
    const msg = activeKeyword
      ? `No results for '${activeKeyword}' in this category.`
      : 'No movies found.';
    return <EmptyState message={msg} />;
  }, [isLoading, isError, activeKeyword]);

  if (isError) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <ErrorMessage
          message="Failed to load movies. Please try again."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      {/* Controls live outside FlatList so dropdowns can overlay list items */}
      <View style={styles.controls}>
        <View style={styles.categoryDropdownWrapper}>
          <DropDownPicker
            open={categoryOpen}
            setOpen={setCategoryOpen}
            onOpen={handleCategoryOpen}
            value={category}
            setValue={cb => {
              const val = typeof cb === 'function' ? cb(category) : cb;
              handleCategoryChange(val);
            }}
            items={CATEGORIES}
            placeholder="Select Category"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            selectedItemContainerStyle={styles.selectedItem}
            selectedItemLabelStyle={styles.selectedItemLabel}
            showTickIcon={false}
            ArrowDownIconComponent={ChevronRight}
            ArrowUpIconComponent={ChevronDown}
          />
        </View>
        <View style={styles.sortDropdownWrapper}>
          <DropDownPicker
            open={sortOpen}
            setOpen={setSortOpen}
            onOpen={handleSortOpen}
            value={sortDisplayValue}
            setValue={cb => {
              const val = typeof cb === 'function' ? cb(sortDisplayValue) : cb;
              handleSortChange(val);
            }}
            items={SORT_OPTIONS}
            placeholder="Sort By"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            selectedItemContainerStyle={styles.selectedItem}
            selectedItemLabelStyle={styles.selectedItemLabel}
            showTickIcon={false}
            ArrowDownIconComponent={ChevronRight}
            ArrowUpIconComponent={ChevronDown}
          />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.placeholder}
          value={searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          accessibilityLabel="Search movies"
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearch}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={visibleMovies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  controls: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    zIndex: 10,
    elevation: 10,
    backgroundColor: Colors.background,
  },
  dropdown: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  dropdownContainer: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selectedItem: {
    backgroundColor: Colors.primary,
  },
  selectedItemLabel: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  searchBtn: {
    backgroundColor: '#D1D5DB',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  searchBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  loadMoreBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  loadMoreText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  categoryDropdownWrapper: {
    zIndex: 3000,
  },
  sortDropdownWrapper: {
    zIndex: 2000,
  },
});

export default HomeScreen;
