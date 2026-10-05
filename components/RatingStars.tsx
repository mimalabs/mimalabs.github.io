export function RatingStars({ score, suffix }: { score: number; suffix: string }) {
  const width = `${Math.max(0, Math.min(100, score * 10))}%`;
  return (
    <div className="flex items-center gap-3" aria-label={`${score} ${suffix}`}>
      <div className="relative text-[.9rem] tracking-[.08em] text-brand-line" aria-hidden="true">
        <span>★★★★★</span>
        <span className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-brand-terracotta" style={{ width }}>★★★★★</span>
      </div>
      <span className="whitespace-nowrap text-sm font-black text-brand-brown">{score}/10</span>
    </div>
  );
}
