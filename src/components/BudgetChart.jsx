import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BUDGET_CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

export const BudgetChart = ({ budget, onChange }) => {
  const total = useMemo(
    () => Object.values(budget || {}).reduce((s, v) => s + (Number(v) || 0), 0),
    [budget]
  );

  const segments = useMemo(() => {
    let offset = 0;
    const circumference = 2 * Math.PI * 70;
    return BUDGET_CATEGORIES.map((cat) => {
      const value = Number(budget?.[cat.key]) || 0;
      const pct = total ? value / total : 0.2;
      const dash = pct * circumference;
      const seg = { ...cat, dash, offset, value, pct };
      offset += dash;
      return seg;
    });
  }, [budget, total]);

  return (
    <div className="budget-chart-wrap">
      <div className="budget-ring">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
          {segments.map((seg) => (
            <motion.circle
              key={seg.key}
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${seg.dash} ${2 * Math.PI * 70}`}
              strokeDashoffset={-seg.offset}
              initial={{ strokeDasharray: `0 ${2 * Math.PI * 70}` }}
              animate={{ strokeDasharray: `${seg.dash} ${2 * Math.PI * 70}` }}
              transition={{ duration: 0.8 }}
            />
          ))}
        </svg>
        <div className="budget-ring-center">
          <strong style={{ fontSize: '1.25rem' }}>{formatCurrency(total)}</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Budget</span>
        </div>
      </div>
      <div className="budget-legend">
        {BUDGET_CATEGORIES.map((cat) => (
          <div key={cat.key} className="budget-legend-item">
            <span className="budget-legend-dot" style={{ background: cat.color }} />
            <span>{cat.label}</span>
            <strong style={{ marginLeft: 'auto' }}>{formatCurrency(budget?.[cat.key])}</strong>
          </div>
        ))}
        {onChange && (
          <div className="budget-inputs">
            {BUDGET_CATEGORIES.map((cat) => (
              <div key={cat.key} className="budget-input-row">
                <label>{cat.label}</label>
                <input
                  type="number"
                  value={budget?.[cat.key] ?? 0}
                  onChange={(e) => onChange(cat.key, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
