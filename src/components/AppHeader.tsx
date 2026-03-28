import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Spacing} from '../theme/tokens';

const AppHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: insets.top + Spacing.sm}]}>
      <View style={styles.logoWrapper}>
        <Text style={styles.theText}>THE</Text>
        <View style={styles.row}>
          <View style={styles.pillCyan} />
          <Text style={styles.movieText}>MOVIE</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.pillGreen} />
          <Text style={styles.dbText}>DB</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  theText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillCyan: {
    width: 28,
    height: 14,
    backgroundColor: Colors.primary,
    borderRadius: 7,
  },
  pillGreen: {
    width: 28,
    height: 14,
    backgroundColor: Colors.scoreArcGreen,
    borderRadius: 7,
  },
  movieText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  dbText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
});

export default AppHeader;
