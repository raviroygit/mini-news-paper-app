import { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { ThemeContext } from '@/contexts/ThemeContext';
import { NetworkContext } from '@/contexts/NetworkContext';
import { searchArticles } from '@/utils/api';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import Header from '@/components/Header';

export default function SearchScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const { isConnected } = useContext(NetworkContext);
  const insets = useSafeAreaInsets();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    if (!isConnected) {
      setError('No internet connection. Please connect to search for articles.');
      return;
    }
    
    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const data = await searchArticles(searchQuery);
      setArticles(data);
    } catch (err) {
      setError('Unable to search for articles. Please try again later.');
      console.error('Error searching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundColor = isDarkMode ? '#111827' : '#F9FAFB';

  if (isLoading) {
    return <LoadingState message={`Searching for "${query}"...`} />;
  }

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      <Header title="Search News" />
      
      <SearchBar onSearch={handleSearch} />
      
      {!isConnected && (
        <View style={[
          styles.offlineBar,
          { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }
        ]}>
          <Text style={[
            styles.offlineText,
            { color: isDarkMode ? '#D1D5DB' : '#4B5563' }
          ]}>
            You're offline. Connect to search for articles.
          </Text>
        </View>
      )}
      
      {error ? (
        <ErrorState message={error} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => <ArticleCard article={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            hasSearched ? (
              <EmptyState 
                message={`No results found for "${query}"`} 
                subMessage="Try searching for a different term"
              />
            ) : (
              <EmptyState 
                message="Search for news articles" 
                subMessage="Enter keywords above to find articles"
              />
            )
          }
        />
      )}
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