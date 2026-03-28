import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import WatchlistScreen from '../screens/WatchlistScreen';
import { Colors } from '../theme/tokens';

export type RootTabParamList = {
  HomeTab: { screen: string; params?: object } | undefined;
  WatchlistTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Icons are always white; the wrapper opacity handles active/inactive state.
const HouseIcon: React.FC = () => (
  <View style={styles.houseWrapper}>
    <View style={styles.roofTriangle} />
    <View style={styles.houseBody}>
      <View style={styles.houseDoor} />
    </View>
  </View>
);

const BookmarkIcon: React.FC = () => (
  <View style={styles.bookmarkWrapper}>
    <View style={styles.bookmarkBody} />
    <View style={styles.notchLeft} />
    <View style={styles.notchRight} />
  </View>
);

const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryDark,
          borderTopWidth: 0,
          height: 60,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: focused ? 1 : 0.4 }}>
              <HouseIcon />
            </View>
          ),
          tabBarAccessibilityLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: focused ? 1 : 0.4 }}>
              <BookmarkIcon />
            </View>
          ),
          tabBarAccessibilityLabel: 'Watchlist',
        }}
      />
    </Tab.Navigator>
  );
};

// House dimensions
const ROOF_HALF = 11;          // roof base = 22px wide
const ROOF_H = 10;
const BODY_W = ROOF_HALF * 2;  // 22px — matches roof base
const BODY_H = 13;
const DOOR_W = 6;
const DOOR_H = 8;

// Bookmark dimensions
const BM_W = 16;
const BM_H = 24;
const NOTCH_H = 8;             // V-notch depth

const styles = StyleSheet.create({
  // ── House ──────────────────────────────────────────────────────────────────
  houseWrapper: {
    alignItems: 'center',
  },
  roofTriangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: ROOF_HALF,
    borderRightWidth: ROOF_HALF,
    borderBottomWidth: ROOF_H,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  houseBody: {
    width: BODY_W,
    height: BODY_H,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  houseDoor: {
    width: DOOR_W,
    height: DOOR_H,
    backgroundColor: Colors.primaryDark,
    borderTopLeftRadius: DOOR_W / 2,
    borderTopRightRadius: DOOR_W / 2,
  },

  // ── Bookmark ────────────────────────────────────────────────────────────────
  bookmarkWrapper: {
    width: BM_W,
    height: BM_H,
  },
  bookmarkBody: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BM_W,
    height: BM_H,
    backgroundColor: '#FFFFFF',
  },
  notchLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: BM_W / 2,
    borderTopWidth: NOTCH_H,
    borderRightColor: 'transparent',
    borderTopColor: Colors.primaryDark,
  },
  notchRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: BM_W / 2,
    borderTopWidth: NOTCH_H,
    borderLeftColor: 'transparent',
    borderTopColor: Colors.primaryDark,
  },
});

export default RootNavigator;
