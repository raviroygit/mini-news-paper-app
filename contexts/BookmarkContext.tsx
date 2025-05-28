import { createContext, ReactNode, useState, useEffect } from 'react';
import { getBookmarks, saveBookmarks } from '@/utils/storage';
import { Article } from '@/types';

type BookmarkContextType = {
  bookmarks: Article[];
  addBookmark: (article: Article) => void;
  removeBookmark: (url: string) => void;
};

export const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
});

type BookmarkProviderProps = {
  children: ReactNode;
};

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  useEffect(() => {
    // Load bookmarks from storage
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await getBookmarks();
        setBookmarks(savedBookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, []);

  const addBookmark = async (article: Article) => {
    try {
      // Check if article is already bookmarked
      if (bookmarks.some(bookmark => bookmark.url === article.url)) {
        return;
      }
      
      const updatedBookmarks = [...bookmarks, article];
      setBookmarks(updatedBookmarks);
      await saveBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (url: string) => {
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.url !== url);
      setBookmarks(updatedBookmarks);
      await saveBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}