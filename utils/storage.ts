import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/types';

// Storage keys
const ARTICLES_STORAGE_KEY = '@news_reader_articles';
const BOOKMARKS_STORAGE_KEY = '@news_reader_bookmarks';

/**
 * Save articles to AsyncStorage for offline access
 */
export const saveArticlesToStorage = async (articles: Article[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(articles);
    await AsyncStorage.setItem(ARTICLES_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving articles to storage:', error);
  }
};

/**
 * Get articles from AsyncStorage
 */
export const getStoredArticles = async (): Promise<Article[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ARTICLES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting articles from storage:', error);
    return [];
  }
};

/**
 * Save bookmarks to AsyncStorage
 */
export const saveBookmarks = async (bookmarks: Article[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(bookmarks);
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving bookmarks to storage:', error);
  }
};

/**
 * Get bookmarks from AsyncStorage
 */
export const getBookmarks = async (): Promise<Article[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting bookmarks from storage:', error);
    return [];
  }
};

/**
 * Get a specific article by its URL
 */
export const getArticleById = async (url: string): Promise<Article | null> => {
  try {
    // First, check bookmarks (since users might want to access bookmarked articles)
    const bookmarks = await getBookmarks();
    const bookmarkedArticle = bookmarks.find(article => article.url === url);
    if (bookmarkedArticle) {
      return bookmarkedArticle;
    }
    
    // If not found in bookmarks, check stored articles
    const articles = await getStoredArticles();
    const article = articles.find(article => article.url === url);
    
    return article || null;
  } catch (error) {
    console.error('Error getting article by ID:', error);
    return null;
  }
};