// Article source type
export type Source = {
  id: string | null;
  name: string;
};

// Article type
export type Article = {
  source: Source;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};