import React, { useState } from 'react';
import type { CategoryScores, CategoryScoreGroup } from '../../types/review';

interface RatingBreakdownProps {
  scores: CategoryScores;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ scores }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  if (!scores) return null;

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scoreEntries = Object.entries(scores).map(([key, group]: [string, CategoryScoreGroup]) => {
    const subCats = Object.values(group.categories || {});
    const count = subCats.length;
    const avg = count > 0 ? subCats.reduce((acc, c) => acc + c.score, 0) / count : 0;
    return {
      key,
      name: group.name || key,
      average: avg,
      percentage: Math.round((avg / 5) * 100),
      subcategories: subCats,
    };
  });

  return (
    <div className="retro-matrix-wrapper">
      <div className="retro-matrix-header">
        <strong>EMANUEL'S GRANULAR SCORING MATRIX</strong>
      </div>
      <div className="retro-matrix-sub">
        Calculated using Emanuel's weighted multi-tier evaluation system (Scores calibrated from 1.00 to 5.00)
      </div>

      <table className="retro-matrix-table">
        <thead>
          <tr>
            <th style={{ width: '28%' }}>CATEGORY</th>
            <th style={{ width: '18%', textAlign: 'center' }}>SCORE</th>
            <th style={{ width: '38%' }}>SCORE BAR</th>
            <th style={{ width: '16%', textAlign: 'center' }}>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {scoreEntries.map((cat) => {
            const isExpanded = !!expandedCategories[cat.key];
            return (
              <React.Fragment key={cat.key}>
                <tr className="category-main-row">
                  <td className="category-name-cell">
                    <strong>{cat.name.toUpperCase()}</strong>
                    <div className="category-count-hint">
                      ({cat.subcategories.length} sub-criteria evaluated)
                    </div>
                  </td>
                  <td className="category-score-cell">
                    <strong>{cat.average.toFixed(2)}</strong> / 5.00
                  </td>
                  <td className="category-bar-cell">
                    <div className="retro-bar-container" title={`${cat.percentage}%`}>
                      <div
                        className="retro-bar-fill"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className="retro-bar-pct">{cat.percentage}%</span>
                  </td>
                  <td className="category-toggle-cell">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.key)}
                      className="btn-retro matrix-toggle-btn"
                    >
                      {isExpanded ? '[-] Hide' : '[+] Inspect'}
                    </button>
                  </td>
                </tr>

                {/* Expanded Subcategories Sub-Table */}
                {isExpanded && (
                  <tr className="category-sub-row">
                    <td colSpan={4}>
                      <div className="subcriteria-panel">
                        <div className="subcriteria-title">
                          Specific Scores for {cat.name}:
                        </div>
                        <table className="subcriteria-table">
                          <tbody>
                            {cat.subcategories.map((sub, idx) => (
                              <tr key={idx}>
                                <td className="sub-name">&bull; {sub.name}:</td>
                                <td className="sub-score">
                                  <strong>{sub.score}</strong> / 5.0
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
