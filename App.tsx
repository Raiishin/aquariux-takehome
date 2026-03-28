import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useWatchlistStore } from './src/store/useWatchlistStore';
import { usePreferencesStore } from './src/store/usePreferencesStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const StoreHydrator: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hydrateWatchlist = useWatchlistStore(state => state.hydrate);
  const hydratePreferences = usePreferencesStore(state => state.hydrate);

  useEffect(() => {
    hydrateWatchlist();
    hydratePreferences();
  }, [hydrateWatchlist, hydratePreferences]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StoreHydrator>
              <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
              <RootNavigator />
            </StoreHydrator>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
