import { useEffect, useState, useMemo } from 'react';
import { supabase, type Raffle } from '@/lib/supabase';
import RaffleCard from '@/components/RaffleCard';

type Props = {
  filter: 'all' | 'car' | 'house' | 'closed';
  onFilterChange: (filter: 'all' | 'car' | 'house' | 'closed') => void;
  onRaffleClick: (raffle: Raffle) => void;
};

type RaffleWithSold = Raffle & { sold_count: number };

export default function HomePage({ filter, onFilterChange, onRaffleClick }: Props) {
  const [raffles, setRaffles] = useState<RaffleWithSold[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('raffles')
        .select('*, tickets(count)')
        .order('created_at', { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      const mapped: RaffleWithSold[] = data.map((r: any) => ({
        ...r,
        sold_count: r.tickets?.[0]?.count ?? 0,
      }));
      setRaffles(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return raffles;
    if (filter === 'closed') return raffles.filter((r) => r.status === 'closed');
    return raffles.filter((r) => r.category === filter && r.status === 'open');
  }, [raffles, filter]);

  const openCount = raffles.filter((r) => r.status === 'open').length;

  const filterLabels: Record<string, string> = {
    all: 'All Raffles',
    car: 'Luxury Cars',
    house: 'Extraordinary Homes',
    closed: 'Winners Circle',
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
              {filterLabels[filter]}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {openCount} active {openCount === 1 ? 'raffle' : 'raffles'}
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 w-full sm:w-auto">
            {[
              { label: 'All', value: 'all' as const },
              { label: 'Cars', value: 'car' as const },
              { label: 'Houses', value: 'house' as const },
              { label: 'Winners', value: 'closed' as const },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => onFilterChange(item.value)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === item.value
                    ? 'glass-gold text-gold-400'
                    : 'glass text-gray-500 hover:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl shimmer-bg h-[420px] animate-fade-in" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">
              No raffles found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((raffle, i) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                soldCount={raffle.sold_count}
                onClick={() => onRaffleClick(raffle)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
