declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_NEWS_API_KEY: string;
    }
  }
}

export {};