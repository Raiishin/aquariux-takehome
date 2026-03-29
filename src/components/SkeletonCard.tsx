import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../theme/tokens';

const SkeletonBox: React.FC<{ style: object }> = ({ style }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.35, { duration: 750 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.box, style, animatedStyle]} />;
};

const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <SkeletonBox style={styles.poster} />
    <View style={styles.content}>
      <SkeletonBox style={styles.title} />
      <SkeletonBox style={styles.date} />
      <SkeletonBox style={styles.line} />
      <SkeletonBox style={styles.lineShort} />
    </View>
  </View>
);

export default SkeletonCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 84,
    height: 126,
    borderRadius: 0,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  box: {
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
  },
  title: {
    height: 16,
    width: '70%',
  },
  date: {
    height: 12,
    width: '40%',
  },
  line: {
    height: 12,
    width: '90%',
  },
  lineShort: {
    height: 12,
    width: '60%',
  },
});
