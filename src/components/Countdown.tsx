type Props = {
  target: string | null;
  compact?: boolean;
};

export default function Countdown({ target, compact = false }: Props) {
  if (!target) return null;

  const now = new Date().getTime();
  const end = new Date(target).getTime();
  const diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Mins', value: minutes },
    { label: 'Secs', value: seconds },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span className="text-gold-400 font-medium">{days}d</span>
        <span className="text-gray-600">/</span>
        <span className="text-gold-400 font-medium">{hours}h</span>
        <span className="text-gray-600">/</span>
        <span className="text-gold-400 font-medium">{minutes}m</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
          <div className="text-center">
            <div className="glass rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 min-w-[60px] sm:min-w-[72px]">
              <div className="text-xl sm:text-2xl font-serif font-semibold text-white tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">
              {unit.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-gold-400/30 text-xl sm:text-2xl font-light -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
