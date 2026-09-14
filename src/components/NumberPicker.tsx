import { useState, useMemo, useCallback } from 'react';
import { Check, Lock, Search, Shuffle } from 'lucide-react';
import { formatNumber } from '@/lib/format';

type Props = {
  maxNumbers: number;
  takenNumbers: Set<number>;
  selectedNumbers: number[];
  onToggle: (num: number) => void;
  maxSelectable?: number;
};

const PAGE_SIZE = 100;

export default function NumberPicker({
  maxNumbers,
  takenNumbers,
  selectedNumbers,
  onToggle,
  maxSelectable = 10,
}: Props) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'selected'>('available');

  const padLength = String(maxNumbers).length;
  const selectedSet = useMemo(() => new Set(selectedNumbers), [selectedNumbers]);

  const totalPages = Math.ceil(maxNumbers / PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const start = page * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, maxNumbers);
    let nums = Array.from({ length: end - start }, (_, i) => start + 1 + i);

    if (filter === 'available') {
      nums = nums.filter((n) => !takenNumbers.has(n));
    } else if (filter === 'selected') {
      nums = nums.filter((n) => selectedSet.has(n));
    }

    if (search) {
      const q = search.trim();
      nums = nums.filter((n) => String(n).includes(q));
    }

    return nums;
  }, [page, maxNumbers, filter, search, takenNumbers, selectedSet]);

  const handleRandom = useCallback(() => {
    const available: number[] = [];
    for (let i = 1; i <= maxNumbers; i++) {
      if (!takenNumbers.has(i) && !selectedSet.has(i)) available.push(i);
    }
    if (available.length === 0) return;

    const count = Math.min(maxSelectable - selectedNumbers.length, 3);
    if (count <= 0) return;

    const picked: number[] = [];
    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      picked.push(available.splice(idx, 1)[0]);
    }
    picked.forEach((n) => onToggle(n));
  }, [maxNumbers, takenNumbers, selectedSet, selectedNumbers, maxSelectable, onToggle]);

  const canSelectMore = selectedNumbers.length < maxSelectable;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search number..."
            className="w-full glass rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'available', 'selected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                filter === f
                  ? 'glass-gold text-gold-400'
                  : 'glass text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'available' ? 'Available' : 'Selected'}
            </button>
          ))}
        </div>
        <button
          onClick={handleRandom}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-gold text-gold-400 text-xs font-medium uppercase tracking-wider hover:bg-gold-400/10 transition-all whitespace-nowrap"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Lucky Dip
        </button>
      </div>

      {/* Number grid */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
          {pageNumbers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-600 text-sm">
              No numbers found
            </div>
          ) : (
            pageNumbers.map((num) => {
              const isTaken = takenNumbers.has(num);
              const isSelected = selectedSet.has(num);
              const isDisabled = isTaken || (!isSelected && !canSelectMore);

              return (
                <button
                  key={num}
                  disabled={isDisabled}
                  onClick={() => onToggle(num)}
                  className={`relative aspect-square rounded-lg text-xs sm:text-sm font-mono font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-500 shadow-lg shadow-gold-500/20 scale-105'
                      : isTaken
                      ? 'bg-white/[0.02] text-gray-700 cursor-not-allowed'
                      : canSelectMore
                      ? 'glass text-gray-300 hover:border-gold-400/30 hover:text-white hover:scale-105'
                      : 'glass text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-4 h-4 absolute inset-0 m-auto" />
                  ) : isTaken ? (
                    <Lock className="w-3 h-3 absolute inset-0 m-auto" />
                  ) : (
                    formatNumber(num, padLength)
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04]">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-xs text-gray-500 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="text-xs text-gray-500 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
