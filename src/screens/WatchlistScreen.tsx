import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import AppHeader from '../components/AppHeader';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import {useWatchlistStore} from '../store/useWatchlistStore';
import {sortMovies} from '../utils/sorting';
import type {MovieListItem, SortOrder, SortDirection, WatchlistMovie} from '../types/tmdb';
import {Colors, FontSize, Radius, Spacing} from '../theme/tokens';
import type {RootTabParamList} from '../navigation/RootNavigator';
import type {HomeStackParamList} from '../navigation/HomeStack';

type WatchlistNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'WatchlistTab'>,
  StackNavigationProp<HomeStackParamList>
>;

const SORT_OPTIONS: {label: string; value: SortOrder}[] = [
  {label: 'By rating', value: 'rating'},
  {label: 'By alphabetical order', value: 'alphabetical'},
  {label: 'By release date', value: 'release_date'},
];

const WatchlistScreen: React.FC = () => {
  const navigation = useNavigation<WatchlistNavigationProp>();
  const {watchlist, removeFromWatchlist} = useWatchlistStore();

  const [filterOrder, setFilterOrder] = useState<SortOrder>('rating');
  const [direction, setDirection] = useState<SortDirection>('desc');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const memberSince = useMemo(() => {
    if (watchlist.length === 0) {
      const now = new Date();
      return now.toLocaleDateString('en-GB', {month: 'long', year: 'numeric'});
    }
    const oldest = Math.min(...watchlist.map(m => m.addedAt));
    const date = new Date(oldest);
    return date.toLocaleDateString('en-GB', {month: 'long', year: 'numeric'});
  }, [watchlist]);

  const sortedWatchlist = useMemo(
    () => sortMovies(watchlist, filterOrder, direction),
    [watchlist, filterOrder, direction],
  );

  const handleBack = useCallback(() => {
    navigation.navigate('HomeTab', {screen: 'Home'});
  }, [navigation]);

  const handleMoviePress = useCallback(
    (movie: MovieListItem) => {
      navigation.navigate('HomeTab', {
        screen: 'Details',
        params: {movieId: movie.id, movieTitle: movie.title},
      });
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeFromWatchlist(id);
    },
    [removeFromWatchlist],
  );

  const handleToggleDirection = useCallback(() => {
    setDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const renderItem = useCallback<ListRenderItem<WatchlistMovie>>(
    ({item}) => (
      <MovieCard
        movie={item}
        onPress={handleMoviePress}
        onRemove={handleRemove}
      />
    ),
    [handleMoviePress, handleRemove],
  );

  const keyExtractor = useCallback(
    (item: WatchlistMovie) => String(item.id),
    [],
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      {/* Profile block */}
      <View style={styles.profileBlock}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go to Home">
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>John Lee</Text>
            <Text style={styles.memberSince}>Member since {memberSince}</Text>
          </View>
        </View>
      </View>

      {/* Watchlist controls — outside FlatList so dropdown overlays list */}
      <View style={styles.bodyHeader}>
        <Text style={styles.watchlistTitle}>My Watchlist</Text>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by:</Text>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              value={filterOrder}
              setValue={(cb) => {
                const val = typeof cb === 'function' ? cb(filterOrder) : cb;
                if (val) setFilterOrder(val);
              }}
              items={SORT_OPTIONS}
              style={styles.filterDropdown}
              dropDownContainerStyle={styles.filterDropdownContainer}
              textStyle={styles.filterDropdownText}
              selectedItemContainerStyle={styles.filterSelectedItem}
              selectedItemLabelStyle={styles.filterSelectedItemLabel}
              containerStyle={styles.filterDropdownContainer2}
            />
          </View>
          <Text style={styles.orderLabel}>Order:</Text>
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={handleToggleDirection}
            accessibilityRole="button"
            accessibilityLabel={`Sort direction: ${direction === 'asc' ? 'ascending' : 'descending'}`}>
            <Text style={styles.orderBtnText}>
              {direction === 'asc' ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedWatchlist}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            message="Your watchlist is empty"
            subMessage="Add movies from the Details screen."
          />
        }
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
  profileBlock: {
    backgroundColor: Colors.primaryDark,
    padding: Spacing.lg,
  },
  backBtn: {
    marginBottom: Spacing.md,
  },
  backChevron: {
    fontSize: 28,
    color: Colors.textOnDark,
    fontWeight: '300',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
  },
  bodyHeader: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
    elevation: 10,
  },
  watchlistTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  dropdownWrapper: {
    flex: 1,
    zIndex: 1000,
  },
  filterDropdownContainer2: {
    flex: 1,
  },
  filterDropdown: {
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primary,
    borderRadius: 0,
    backgroundColor: Colors.surface,
    minHeight: 36,
  },
  filterDropdownContainer: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterDropdownText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  filterSelectedItem: {
    backgroundColor: Colors.primary,
  },
  filterSelectedItemLabel: {
    color: Colors.textOnPrimary,
  },
  orderLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  orderBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderBtnText: {
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
});

export default WatchlistScreen;
