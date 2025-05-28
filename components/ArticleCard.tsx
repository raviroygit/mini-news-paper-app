import { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BookmarkContext } from '@/contexts/BookmarkContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Article } from '@/types';
import { format } from 'date-fns';
import { BookmarkPlus, Bookmark as BookmarkIcon } from 'lucide-react-native';

type ArticleCardProps = {
  article: Article;
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - (CARD_MARGIN * 2);

export default function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const { bookmarks, addBookmark, removeBookmark } = useContext(BookmarkContext);
  
  const isBookmarked = bookmarks.some(bookmark => bookmark.url === article.url);
  
  const handlePress = () => {
    router.push(`/article/${encodeURIComponent(article.url)}`);
  };
  
  const handleBookmarkToggle = (e: any) => {
    e.stopPropagation();
    
    if (isBookmarked) {
      removeBookmark(article.url);
    } else {
      addBookmark(article);
    }
  };
  
  const cardBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: cardBgColor },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textContent}>
          <View style={styles.sourceRow}>
            <Text style={[styles.source, { color: isDarkMode ? '#60A5FA' : '#2563EB' }]}>
              {article.source.name}
            </Text>
            <Text style={[styles.date, { color: secondaryTextColor }]}>
              {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : 'Unknown date'}
            </Text>
          </View>
          
          <Text 
            style={[styles.title, { color: textColor }]} 
            numberOfLines={2}
          >
            {article.title}
          </Text>
          
          <Text 
            style={[styles.description, { color: secondaryTextColor }]} 
            numberOfLines={2}
          >
            {article.description || 'No description available'}
          </Text>
        </View>
        
        {article.urlToImage ? (
          <Image 
            source={{ uri: article.urlToImage }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.bookmarkButton} 
        onPress={handleBookmarkToggle}
      >
        {isBookmarked ? (
          <BookmarkIcon 
            size={20} 
            fill={isDarkMode ? '#60A5FA' : '#2563EB'} 
            color={isDarkMode ? '#60A5FA' : '#2563EB'} 
          />
        ) : (
          <BookmarkPlus 
            size={20} 
            color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  bookmarkButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 4,
  },
});