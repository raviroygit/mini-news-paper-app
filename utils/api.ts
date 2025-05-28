import axios from 'axios';
import { Article } from '@/types';
import { getStoredArticles, saveArticlesToStorage } from './storage';
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || '';
const API_BASE_URL = 'https://newsapi.org/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export const fetchTopHeadlines = async (): Promise<Article[]> => {
  try {
    if (!API_KEY) {
      return getMockData();
    }

    if (Platform.OS === 'web' && process.env.NODE_ENV !== 'development') {
      return getMockData();
    }

    const today = new Date();
    const yyyy = today.getUTCFullYear();
    const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(today.getUTCDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    console.log('from,to', formattedDate, formattedDate);
    const response = await api.get('/everything', {
      params: {
        q: 'news',
        from: formattedDate,
        to: formattedDate,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 20,
      },
    });

    if (response.data.articles?.length) {
      await saveArticlesToStorage(response.data.articles);
      return response.data.articles;
    }

    const storedArticles = await getStoredArticles();
    if (storedArticles.length) {
      return storedArticles;
    }

    return getMockData();
  } catch (error) {
    console.error('Error fetching top headlines:', error);

    const storedArticles = await getStoredArticles();
    if (storedArticles.length) {
      return storedArticles;
    }

    return getMockData();
  }
};

export const searchArticles = async (query: string): Promise<Article[]> => {
  try {
    if (!API_KEY) {
      const mockData = getMockData();
      return mockData.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (Platform.OS === 'web' && process.env.NODE_ENV !== 'development') {
      const mockData = getMockData();
      return mockData.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    const today = new Date();
    const yyyy = today.getUTCFullYear();
    const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(today.getUTCDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const response = await api.get('/everything', {
      params: {
        q: 'news',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 20,
      },
    });

    return response.data.articles;
  } catch (error) {
    console.error('Error searching articles:', error);

    const storedArticles = await getStoredArticles();
    if (storedArticles.length) {
      return storedArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    throw error;
  }
};

const getMockData = (): Article[] => {
  return [
    {
      source: { id: 'techcrunch', name: 'TechCrunch' },
      author: 'Jane Smith',
      title: 'New AI Breakthrough Promises Faster Computing',
      description:
        'Researchers have developed a new algorithm that could revolutionize machine learning applications.',
      url: 'https://example.com/article1',
      urlToImage:
        'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
      publishedAt: '2023-04-21T12:00:00Z',
      content:
        'Artificial intelligence researchers have made a significant breakthrough in neural network efficiency...',
    },
    {
      source: { id: 'reuters', name: 'Reuters' },
      author: 'John Doe',
      title: 'Global Markets Hit Record Highs Amid Economic Recovery',
      description:
        'Stock markets worldwide reached unprecedented levels as economies rebound from pandemic lows.',
      url: 'https://example.com/article2',
      urlToImage:
        'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg',
      publishedAt: '2023-04-20T09:15:00Z',
      content:
        'Global markets surged to record highs on Thursday as investors responded positively to strong economic data...',
    },
    {
      source: { id: 'nyt', name: 'New York Times' },
      author: 'Sarah Johnson',
      title: 'Climate Summit Ends with New Commitments from Major Nations',
      description:
        'Leaders from over 40 countries agreed to ambitious emission reduction targets at the latest climate conference.',
      url: 'https://example.com/article3',
      urlToImage:
        'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
      publishedAt: '2023-04-19T15:30:00Z',
      content:
        'The week-long climate summit concluded with several major economies announcing new targets for carbon neutrality...',
    },
  ];
};
