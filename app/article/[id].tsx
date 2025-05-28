import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookmarkContext } from '@/contexts/BookmarkContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Article } from '@/types';
import { getArticleById } from '@/utils/storage';
import { format } from 'date-fns';
import { ArrowLeft, BookmarkPlus, Bookmark as BookmarkIcon, Share2, ExternalLink } from 'lucide-react-native';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(ThemeContext);
  const { bookmarks, addBookmark, removeBookmark } = useContext(BookmarkContext);
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isBookmarked = bookmarks.some(bookmark => bookmark.url === article?.url);
  
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        const decodedId = decodeURIComponent(id);
        const foundArticle = await getArticleById(decodedId);
        setArticle(foundArticle);
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [id]);
  
  const handleBookmarkToggle = () => {
    if (!article) return;
    
    if (isBookmarked) {
      removeBookmark(article.url);
    } else {
      addBookmark(article);
    }
  };
  
  const handleShare = async () => {
    if (!article) return;
    
    try {
      await Share.share({
        message: `Check out this article: ${article.title} - ${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };
  
  const handleOpenInBrowser = async () => {
    if (!article) return;
    
    try {
      await Linking.openURL(article.url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };
  
  const backgroundColor = isDarkMode ? '#111827' : '#F9FAFB';
  const textColor = isDarkMode ? '#F3F4F6' : '#1F2937';
  const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const cardBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#60A5FA' : '#2563EB'} />
        <Text style={[styles.loadingText, { color: textColor }]}>Loading article...</Text>
      </View>
    );
  }
  
  if (!article) {
    return (
      <View style={[styles.errorContainer, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>Article not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: isDarkMode ? '#60A5FA' : '#2563EB' }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
        headerLeft: () => (
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft 
              size={24} 
              color={isDarkMode ? '#F3F4F6' : '#1F2937'} 
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBookmarkToggle}>
              {isBookmarked ? (
                <BookmarkIcon 
                  size={24} 
                  fill={isDarkMode ? '#60A5FA' : '#2563EB'} 
                  color={isDarkMode ? '#60A5FA' : '#2563EB'} 
                />
              ) : (
                <BookmarkPlus 
                  size={24} 
                  color={isDarkMode ? '#F3F4F6' : '#1F2937'} 
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Share2 
                size={24} 
                color={isDarkMode ? '#F3F4F6' : '#1F2937'} 
              />
            </TouchableOpacity>
          </View>
        ),
      }} />
      
      <ScrollView 
        style={[styles.container, { backgroundColor }]}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 60 }]}
      >
        {article.urlToImage && (
          <Image 
            source={{ uri: article.urlToImage }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        
        <View style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{article.title}</Text>
          
          <View style={styles.meta}>
            <Text style={[styles.source, { color: isDarkMode ? '#60A5FA' : '#2563EB' }]}>
              {article.source.name}
            </Text>
            <Text style={[styles.date, { color: secondaryTextColor }]}>
              {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : 'Unknown date'}
            </Text>
          </View>
          
          {article.author && (
            <Text style={[styles.author, { color: secondaryTextColor }]}>
              By {article.author}
            </Text>
          )}
          
          <Text style={[styles.description, { color: textColor }]}>
            {article.description}
          </Text>
          
          <Text style={[styles.content, { color: textColor }]}>
            {article.content || 'No content available. Please click the link below to read the full article.'}
          </Text>
          
          <TouchableOpacity 
            style={[styles.readMoreButton, { backgroundColor: isDarkMode ? '#60A5FA' : '#2563EB' }]} 
            onPress={handleOpenInBrowser}
          >
            <Text style={styles.readMoreText}>Read Full Article</Text>
            <ExternalLink size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: 240,
  },
  card: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  source: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  author: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});