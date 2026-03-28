import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, FontSize, Spacing} from '../theme/tokens';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({message, subMessage}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎬</Text>
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subMessage: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
