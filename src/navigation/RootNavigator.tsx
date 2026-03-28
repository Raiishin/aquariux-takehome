import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import HomeStack from './HomeStack';
import WatchlistScreen from '../screens/WatchlistScreen';
import { Colors } from '../theme/tokens';

export type RootTabParamList = {
  HomeTab: { screen: string; params?: object } | undefined;
  WatchlistTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Exact Figma path — Vector.svg (18×16 viewBox)
// House with peaked roof, walls, and door cutout.
const HouseIcon: React.FC<{color: string}> = ({color}) => (
  <Svg width={28} height={25} viewBox="0 0 18 16" fill="none">
    <Path
      d="M8.97879 0L0.0157245 7.3891C0.0157245 7.39953 0.0131039 7.41487 0.00786246 7.43578C0.00273019 7.45653 0 7.4716 0 7.4823V14.9645C0 15.2347 0.0987689 15.4688 0.296252 15.666C0.49368 15.8632 0.727471 15.9625 0.99768 15.9625H6.98332V9.97652H10.9743V15.9627H16.9599C17.2301 15.9627 17.4642 15.8637 17.6613 15.666C17.8588 15.469 17.9579 15.2347 17.9579 14.9645V7.4823C17.9579 7.4408 17.9522 7.40946 17.9422 7.3891L8.97879 0Z"
      fill={color}
    />
  </Svg>
);

// Exact Figma path — Watchlist.svg (16×20 viewBox)
// Bookmark ribbon with V-notch at the bottom.
const BookmarkIcon: React.FC<{color: string}> = ({color}) => (
  <Svg width={20} height={25} viewBox="0 0 16 20" fill="none">
    <Path
      d="M13.3789 0C14.3238 0 15.0906 0.777203 15.0908 1.69727V18.8643C15.0907 19.6489 14.6467 20 14.1914 20C13.9223 19.9999 13.6547 19.8794 13.3887 19.6523L8.21484 15.2461C8.05412 15.1088 7.82421 15.0304 7.58496 15.0303C7.34548 15.0303 7.11444 15.1082 6.9541 15.2451L1.7627 19.6533C1.49748 19.8799 1.21017 20 0.94043 20C0.65516 20.0001 0.388857 19.864 0.223633 19.627C0.0855771 19.4287 7.92182e-05 19.172 0 18.8643V1.69727C0.000287967 0.77736 0.829701 0.000265203 1.77441 0H13.3789Z"
      fill={color}
    />
  </Svg>
);

const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryDark,
          borderTopWidth: 0,
          height: 70,
        },
        tabBarItemStyle: {
          paddingTop: 14,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <HouseIcon color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.4)'} />
          ),
          tabBarAccessibilityLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <BookmarkIcon color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.4)'} />
          ),
          tabBarAccessibilityLabel: 'Watchlist',
        }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;
