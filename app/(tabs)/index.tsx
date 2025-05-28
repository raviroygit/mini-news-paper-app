import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, RefreshControl, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { ThemeContext } from '@/contexts/ThemeContext';
import { fetchTopHeadlines } from '@/utils/api';
import { saveArticlesToStorage } from '@/utils/storage';
import { Article } from '@/types';
import { NetworkContext } from '@/contexts/NetworkContext';
import ArticleCard from '@/components/ArticleCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import Header from '@/components/Header';

export default function HomeScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const { isConnected } = useContext(NetworkContext);
  const insets = useSafeAreaInsets();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadArticles = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    if (!refresh) setIsLoading(true);
    
    setError(null);
    
    try {
      const data = await fetchTopHeadlines();
      setArticles(data);
      
      // Save articles to storage for offline access
      if (data.length > 0) {
        await saveArticlesToStorage(data);
      }
    } catch (err) {
      setError('Unable to load articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (isConnected) {
      loadArticles(true);
    } else {
      setRefreshing(false);
      setError('No internet connection. Pull to refresh when back online.');
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const backgroundColor = isDarkMode ? '#111827' : '#F9FAFB';
  
  if (isLoading) {
    return <LoadingState message="Loading top stories..." />;
  }

  if (error && !articles.length) {
    return <ErrorState message={error} onRetry={loadArticles} />;
  }

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      <Header title="Today's Headlines" />
      
      {!isConnected && (
        <View style={[
          styles.offlineBar,
          { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }
        ]}>
          <Text style={[
            styles.offlineText,
            { color: isDarkMode ? '#D1D5DB' : '#4B5563' }
          ]}>
            You're offline. Showing saved articles.
          </Text>
        </View>
      )}
      
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => <ArticleCard article={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState 
            message="No articles available" 
            subMessage="Pull down to refresh when connected"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor={isDarkMode ? '#60A5FA' : '#2563EB'}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  offlineBar: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }
});