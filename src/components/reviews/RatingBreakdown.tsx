import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';
import type { CategoryScores, CategoryScoreGroup } from '../../types/review';

interface RatingBreakdownProps {
  scores: CategoryScores;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ scores }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!scores) return null;

  const toggleCategory = (key: string) => {
    setExpandedCategory((prev) => (prev === key ? null : key));
  };

  // Convert category scores dictionary to array with calculated category averages
  const scoreEntries = Object.entries(scores).map(([key, group]: [string, CategoryScoreGroup]) => {
    const subCats = Object.values(group.categories || {});
    const count = subCats.length;
    const avg = count > 0 ? subCats.reduce((acc, c) => acc + c.score, 0) / count : 0;
    return {
      key,
      name: group.name || key,
      average: avg,
      percentage: (avg / 5) * 100,
      subcategories: subCats,
    };
  });

  return (
    <div className="score-matrix-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--color-accent-gold)" />
          <span>Precision Score Breakdown</span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Click category to inspect sub-scores
        </span>
      </div>

      <div className="categories-container">
        {scoreEntries.map((cat) => {
          const isExpanded = expandedCategory === cat.key;
          return (
            <div key={cat.key} className="category-row">
              <div
                className="category-row-header"
                onClick={() => toggleCategory(cat.key)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className="category-name">
                  <span>{cat.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({cat.subcategories.length} criteria)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="category-score-val">{cat.average.toFixed(2)}</div>
                  {isExpanded ? (
                    <ChevronUp size={16} color="var(--text-muted)" />
                  ) : (
                    <ChevronDown size={16} color="var(--text-muted)" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="category-progress-bar">
                <div
                  className="category-progress-fill"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              {/* Collapsible Subcategories */}
              {isExpanded && (
                <div className="subcategories-list">
                  {cat.subcategories.map((sub, idx) => (
                    <div key={idx} className="subcategory-item">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={12} color="var(--color-accent-gold)" />
                        <span>{sub.name}</span>
                      </span>
                      <span className="subcategory-score">{sub.score} / 5</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
