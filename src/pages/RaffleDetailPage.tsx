import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  Car,
  Home,
  Users,
  Clock,
  Trophy,
  CheckCircle2,
  Shield,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { supabase, type Raffle } from '@/lib/supabase';
import { formatPrice, formatNumber, formatDate } from '@/lib/format';
import Countdown from '@/components/Countdown';
import NumberPicker from '@/components/NumberPicker';
import CheckoutModal from '@/components/CheckoutModal';
import WinnerBanner from '@/components/WinnerBanner';

type Props = {
  raffle: Raffle;
  onBack: () => void;
};

export default function RaffleDetailPage({ raffle, onBack }: Props) {
  const [takenNumbers, setTakenNumbers] = useState<Set<number>>(new Set());
  const [soldCount, setSoldCount] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  const isClosed = raffle.status === 'closed';
  const padLength = String(raffle.max_numbers).length;
  const maxSelectable = 10;
  const total = selectedNumbers.length * raffle.ticket_price;

  const loadTickets = useCallback(async () => {
    const { data } = await supabase
      .from('tickets')
      .select('number')
      .eq('raffle_id', raffle.id);

    if (data) {
      setTakenNumbers(new Set(data.map((t) => t.number)));
      setSoldCount(data.length);
    }
    setLoading(false);
  }, [raffle.id]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleToggle = useCallback((num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      }
      if (prev.length >= maxSelectable) return prev;
      return [...prev, num].sort((a, b) => a - b);
    });
  }, []);

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setSelectedNumbers([]);
    loadTickets();
  };

  const specs = raffle.specs || {};
  const specEntries = Object.entries(specs);
  const progress = Math.min((soldCount / raffle.max_numbers) * 100, 100);
  const remaining = raffle.max_numbers - soldCount;

  return (
    <div className="min-h-screen pt-20">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Raffles
        </button>
      </div>

      {/* Winner Banner for closed raffles */}
      {isClosed && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-8">
          <WinnerBanner raffle={raffle} />
        </div>
      )}

      {/* Hero image */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-8">
        <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden">
          <img
            src={raffle.image_url}
            alt={raffle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-500 via-ink-500/40 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-5 left-5">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${
              raffle.category === 'car'
                ? 'bg-black/40 border border-gold-400/20 text-gold-300'
                : 'bg-black/40 border border-white/10 text-gray-300'
            }`}>
              {raffle.category === 'car' ? <Car className="w-3 h-3" /> : <Home className="w-3 h-3" />}
              <span className="uppercase tracking-wider">{raffle.category}</span>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="text-xs uppercase tracking-widest text-gold-400/80 mb-2">
              {raffle.subtitle}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-white mb-2">
              {raffle.title}
            </h1>
            {raffle.prize_value && (
              <div className="text-sm text-gray-400">
                Prize Value: <span className="text-gold-400 font-medium">{raffle.prize_value}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gold-400/70 mb-4">
                About This Prize
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">
                {raffle.description}
              </p>
            </div>

            {/* Specs */}
            {specEntries.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold-400/70 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specEntries.map(([key, value]) => (
                    <div key={key} className="glass rounded-xl p-4">
                      <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-1.5">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-gray-200 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Number selection or closed info */}
            {!isClosed ? (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gold-400/70 mb-1">
                      Choose Your Numbers
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select up to {maxSelectable} numbers. {formatPrice(raffle.ticket_price)} per entry.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="h-64 shimmer-bg rounded-2xl" />
                ) : (
                  <NumberPicker
                    maxNumbers={raffle.max_numbers}
                    takenNumbers={takenNumbers}
                    selectedNumbers={selectedNumbers}
                    onToggle={handleToggle}
                    maxSelectable={maxSelectable}
                  />
                )}
              </div>
            ) : (
              /* Closed raffle - show all numbers with winner highlighted */
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold-400/70 mb-5">
                  All Entries
                </h3>
                {loading ? (
                  <div className="h-64 shimmer-bg rounded-2xl" />
                ) : (
                  <div className="glass rounded-2xl p-4 sm:p-5">
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
                      {Array.from({ length: Math.min(raffle.max_numbers, 200) }, (_, i) => {
                        const num = i + 1;
                        const isWinner = num === raffle.winner_number;
                        const isTaken = takenNumbers.has(num);
                        return (
                          <div
                            key={num}
                            className={`aspect-square rounded-lg text-xs font-mono font-medium flex items-center justify-center ${
                              isWinner
                                ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-500 shadow-lg shadow-gold-500/30 scale-105 relative'
                                : isTaken
                                ? 'bg-white/[0.03] text-gray-600'
                                : 'bg-white/[0.01] text-gray-700'
                            }`}
                          >
                            {isWinner ? (
                              <Trophy className="w-4 h-4" />
                            ) : (
                              formatNumber(num, padLength)
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {raffle.max_numbers > 200 && (
                      <p className="text-center text-xs text-gray-600 mt-4">
                        Showing first 200 of {raffle.max_numbers.toLocaleString()} numbers
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Stats card */}
              <div className="glass rounded-2xl p-6 space-y-5">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {soldCount.toLocaleString()} sold
                    </span>
                    <span className="text-xs text-gray-500">
                      {remaining.toLocaleString()} remaining
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1.5">
                    {progress.toFixed(0)}% claimed
                  </div>
                </div>

                <div className="h-px bg-white/[0.04]" />

                {/* Price */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                      Per Number
                    </div>
                    <div className="text-2xl font-serif font-semibold text-white">
                      {formatPrice(raffle.ticket_price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                      Prize Value
                    </div>
                    <div className="text-lg font-serif font-semibold text-gold-400">
                      {raffle.prize_value}
                    </div>
                  </div>
                </div>

                {/* Countdown */}
                {!isClosed && raffle.end_date && (
                  <>
                    <div className="h-px bg-white/[0.04]" />
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <Clock className="w-3.5 h-3.5 text-gold-400/70" />
                        <span className="text-xs uppercase tracking-widest text-gray-500">
                          Entries Close In
                        </span>
                      </div>
                      <Countdown target={raffle.end_date} />
                    </div>
                  </>
                )}

                {/* Draw date */}
                {raffle.draw_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Trophy className="w-3.5 h-3.5 text-gold-400/70" />
                    <span>
                      Draw: <span className="text-gray-300">{formatDate(raffle.draw_date)}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Selection summary + checkout */}
              {!isClosed && (
                <div className="glass-gold rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-gold-400/70">
                      Your Selection
                    </span>
                    <span className="text-sm text-gray-400">
                      {selectedNumbers.length}/{maxSelectable}
                    </span>
                  </div>

                  {selectedNumbers.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-2 mb-4 max-h-28 overflow-y-auto">
                        {selectedNumbers.map((n) => (
                          <button
                            key={n}
                            onClick={() => handleToggle(n)}
                            className="px-3 py-1.5 rounded-lg bg-gold-400/10 text-gold-400 text-sm font-mono font-medium hover:bg-gold-400/20 transition-colors"
                          >
                            {formatNumber(n, padLength)} ×
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/[0.04] mb-4">
                        <span className="text-sm text-gray-400">Total</span>
                        <span className="text-xl font-serif font-semibold text-gold-400">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowCheckout(true)}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-ink-500 font-medium text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-gold-500/20 transition-all"
                      >
                        Secure Numbers
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500 mb-1">
                        No numbers selected
                      </p>
                      <p className="text-xs text-gray-600">
                        Pick your lucky numbers below
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Trust indicators */}
              <div className="glass rounded-2xl p-5 space-y-3">
                {[
                  { icon: Shield, text: 'Licensed & transparent draws' },
                  { icon: CheckCircle2, text: 'Numbers secured instantly' },
                  { icon: Sparkles, text: 'Premium prizes only' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-gold-400/60 shrink-0" strokeWidth={1.5} />
                    <span className="text-xs text-gray-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && selectedNumbers.length > 0 && (
        <CheckoutModal
          raffle={raffle}
          selectedNumbers={selectedNumbers}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
