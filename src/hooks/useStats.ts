import { useMemo } from 'react';
import type { ReviewSummary } from '../types/review';

export interface DecadeStats {
  decade: string;
  count: number;
  avgScore: number;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface StatsData {
  totalReviews: number;
  averageScore: number;
  filmCount: number;
  tvCount: number;
  filmPercentage: number;
  tvPercentage: number;
  highestRated: ReviewSummary | null;
  lowestRated: ReviewSummary | null;
  distribution: RatingDistribution[];
  decades: DecadeStats[];
  yearBreakdown: { year: number; count: number }[];
}

export function useStats(reviews: ReviewSummary[]): StatsData {
  return useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageScore: 0,
        filmCount: 0,
        tvCount: 0,
        filmPercentage: 0,
        tvPercentage: 0,
        highestRated: null,
        lowestRated: null,
        distribution: [],
        decades: [],
        yearBreakdown: [],
      };
    }

    const totalReviews = reviews.length;
    const totalScore = reviews.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Number((totalScore / totalReviews).toFixed(2));

    const filmCount = reviews.filter((r) => r.type === 'film').length;
    const tvCount = reviews.filter((r) => r.type === 'tv').length;
    const filmPercentage = Number(((filmCount / totalReviews) * 100).toFixed(1));
    const tvPercentage = Number(((tvCount / totalReviews) * 100).toFixed(1));

    const sortedByScore = [...reviews].sort((a, b) => b.score - a.score);
    const highestRated = sortedByScore[0] || null;
    const lowestRated = sortedByScore[sortedByScore.length - 1] || null;

    // Rating distribution: 1 to 5 stars (rounded/floor)
    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const bucket = Math.max(1, Math.min(5, Math.floor(r.score)));
      starCounts[bucket] = (starCounts[bucket] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(starCounts), 1);
    const distribution: RatingDistribution[] = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: starCounts[stars] || 0,
      percentage: Number((((starCounts[stars] || 0) / maxCount) * 100).toFixed(1)),
    }));

    // Group by Decade
    const decadeMap = new Map<string, { count: number; totalScore: number }>();
    reviews.forEach((r) => {
      const dec = `${Math.floor(r.year / 10) * 10}s`;
      const cur = decadeMap.get(dec) || { count: 0, totalScore: 0 };
      cur.count += 1;
      cur.totalScore += r.score;
      decadeMap.set(dec, cur);
    });

    const decades: DecadeStats[] = Array.from(decadeMap.entries())
      .map(([decade, val]) => ({
        decade,
        count: val.count,
        avgScore: Number((val.totalScore / val.count).toFixed(2)),
      }))
      .sort((a, b) => parseInt(a.decade) - parseInt(b.decade));

    // Watched/Reviewed Year Breakdown
    const yearMap = new Map<number, number>();
    reviews.forEach((r) => {
      const year = r.reviewedAt ? new Date(r.reviewedAt).getFullYear() : r.year;
      if (year && !isNaN(year)) {
        yearMap.set(year, (yearMap.get(year) || 0) + 1);
      }
    });

    const yearBreakdown = Array.from(yearMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    return {
      totalReviews,
      averageScore,
      filmCount,
      tvCount,
      filmPercentage,
      tvPercentage,
      highestRated,
      lowestRated,
      distribution,
      decades,
      yearBreakdown,
    };
  }, [reviews]);
}
