import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../theme/tokens';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try Again"
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});

export default ErrorMessage;
