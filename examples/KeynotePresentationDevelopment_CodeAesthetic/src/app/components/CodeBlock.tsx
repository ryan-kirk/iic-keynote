interface CodeBlockProps {
  lines: string[];
  highlight?: number[];
}

export function CodeBlock({ lines, highlight = [] }: CodeBlockProps) {
  return (
    <div className="font-mono text-sm">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`py-1 ${highlight.includes(i) ? 'bg-green-500/20 text-green-300' : 'text-green-500/70'}`}
        >
          <span className="text-green-700 mr-4 select-none">{String(i + 1).padStart(2, '0')}</span>
          <span className="whitespace-pre">{line}</span>
        </div>
      ))}
    </div>
  );
}
