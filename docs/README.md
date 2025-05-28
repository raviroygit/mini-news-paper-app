# News Reader App

A cross-platform React Native mobile app that displays news articles from a public API, supports offline access, and allows bookmarking.

## Features

- **News Feed**: Browse through the latest news articles from various sources
- **Article Details**: View full article content with the option to read more on the original website
- **Search**: Find articles by keywords
- **Bookmarking**: Save articles for later reading
- **Offline Access**: Read previously loaded articles without internet connection
- **Pull-to-Refresh**: Update content with a simple pull gesture
- **Dark Mode**: Switch between light and dark themes for comfortable reading

## Folder Structure

```
/app                   # Expo Router navigation and screens
  /_layout.tsx         # Root layout with providers
  /(tabs)/             # Tab-based navigation
    /_layout.tsx       # Tab configuration
    /index.tsx         # Home screen (News Feed)
    /search.tsx        # Search screen
    /bookmarks.tsx     # Bookmarks screen
  /article/            # Article routes
    /[id].tsx          # Article details screen
/components            # Reusable UI components
  /ArticleCard.tsx     # Card component for articles
  /SearchBar.tsx       # Search input component
  /EmptyState.tsx      # Empty state display
  /ErrorState.tsx      # Error state display
  /LoadingState.tsx    # Loading state display
  /Header.tsx          # Header component with theme toggle
/contexts              # React contexts
  /ThemeContext.tsx    # Dark/light mode context
  /BookmarkContext.tsx # Bookmark management context
  /NetworkContext.tsx  # Network connectivity context
/utils                 # Utility functions
  /api.ts              # API communication
  /storage.ts          # AsyncStorage operations
/types                 # TypeScript type definitions
  /index.ts            # Common types
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/news-reader-app.git
   cd news-reader-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Get an API key from [NewsAPI](https://newsapi.org/) and update it in `/utils/api.ts`

4. Start the development server:
   ```
   npm run dev
   ```

### Running on Mobile Devices

- Install the Expo Go app on your iOS or Android device
- Scan the QR code displayed in the terminal or browser
- For iOS: Scan with your camera app
- For Android: Scan with the Expo Go app

## Assumptions Made

- The app is primarily designed for mobile devices but works on web as well
- NewsAPI's free tier is used, which has limitations for production web use
- Mock data is provided as a fallback when the API cannot be accessed
- The app uses system theme as the default unless user preferences are saved

## Known Issues

- NewsAPI free tier has CORS restrictions for web production use
- Images might not load if the source doesn't allow cross-origin requests
- Some API responses might not include all fields (content, description, etc.)

## Improvements Planned

- Add caching for images to improve offline experience
- Implement category filtering for news articles
- Add support for multiple news sources/APIs
- Implement article sharing via social media
- Add reading time estimates for articles
- Create a reading history feature
- Add text-to-speech functionality for articles
- Implement unit and integration tests

## Technologies Used

- React Native
- Expo
- TypeScript
- AsyncStorage for local persistence
- Lucide React Native for icons
- Axios for API requests
- Expo Router for navigation
- Context API for state management