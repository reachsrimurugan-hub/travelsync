import React from 'react';

const parseInlineMarkdown = (text) => {
  const parts = text.split('**');
  return parts.map((part, j) => {
    if (j % 2 === 1) {
      return <strong key={j}>{part}</strong>;
    }
    // Handle inline code `code`
    const codeParts = part.split('`');
    if (codeParts.length > 1) {
      return codeParts.map((cp, k) => (
        k % 2 === 1 ? <code key={k} className="md-code">{cp}</code> : cp
      ));
    }
    return part;
  });
};

export const MarkdownText = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="md-container">
      {lines.map((line, idx) => {
        // 1. Headers (###)
        if (line.startsWith('### ')) {
          return <h4 key={idx} className="md-h4">{parseInlineMarkdown(line.slice(4))}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={idx} className="md-h3">{parseInlineMarkdown(line.slice(3))}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={idx} className="md-h2">{parseInlineMarkdown(line.slice(2))}</h2>;
        }
        // 2. Bullet points
        if (line.trim().startsWith('• ') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const cleanLine = line.trim().slice(2);
          return (
            <li key={idx} className="md-li">
              {parseInlineMarkdown(cleanLine)}
            </li>
          );
        }
        // 3. Numbered lists (e.g. 1. )
        const numMatch = line.trim().match(/^(\d+)\.\s(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="md-ol-item">
              <span className="md-ol-num">{numMatch[1]}.</span>
              <span className="md-ol-text">{parseInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }
        // 4. Blank line
        if (!line.trim()) {
          return <div key={idx} className="md-br" style={{ height: '0.5rem' }} />;
        }
        // 5. Standard paragraph
        return <p key={idx} className="md-p">{parseInlineMarkdown(line)}</p>;
      })}
    </div>
  );
};
