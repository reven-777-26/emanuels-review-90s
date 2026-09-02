export type MediaType = 'film' | 'tv';

export interface ReviewSummary {
  id: string;
  name: string;
  year: number;
  type: MediaType;
  score: number;
  poster: string;
  reviewedAt: string;
  url: string;
}

export interface ReviewsResponse {
  count: number;
  reviews: ReviewSummary[];
}

export interface SearchResponse {
  query: string;
  count: number;
  results: ReviewSummary[];
}

export interface SubCategoryScore {
  name: string;
  score: number;
}

export interface CategoryScoreGroup {
  name: string;
  categories: Record<string, SubCategoryScore>;
}

export interface CategoryScores {
  story: CategoryScoreGroup;
  characters: CategoryScoreGroup;
  acting: CategoryScoreGroup;
  direction: CategoryScoreGroup;
  visuals: CategoryScoreGroup;
  technical: CategoryScoreGroup;
  music: CategoryScoreGroup;
  experience: CategoryScoreGroup;
  [key: string]: CategoryScoreGroup;
}

export interface ReviewCredits {
  directors: string[];
  actors: string[];
  composers: string[];
}

export interface ReviewArtwork {
  poster: string;
  pageArt: string;
}

export interface ReviewImdb {
  description: string;
  url: string;
}

export interface ReviewDetail {
  id: string;
  name: string;
  year: number;
  type: MediaType;
  imdb: ReviewImdb;
  artwork: ReviewArtwork;
  credits: ReviewCredits;
  review: string;
  score: number;
  scores: CategoryScores;
  watchedAt?: string;
  reviewedAt: string;
  url: string;
}

export interface APIErrorResponse {
  error: string;
}
