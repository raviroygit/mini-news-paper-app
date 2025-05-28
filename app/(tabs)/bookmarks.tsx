import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { ThemeContext } from '@/contexts/ThemeContext';
import { BookmarkContext } from '@/contexts/BookmarkContext';
import ArticleCard from '@/components/ArticleCard';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';

export default function BookmarksScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const { bookmarks } = useContext(BookmarkContext);
  const insets = useSafeAreaInsets();
  
  const backgroundColor = isDarkMode ? '#111827' : '#F9FAFB';

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      <Header title="Bookmarked Articles" />
      
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => <ArticleCard article={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState 
            message="No bookmarked articles" 
            subMessage="Articles you bookmark will appear here"
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
    flexGrow: 1,
  },
});