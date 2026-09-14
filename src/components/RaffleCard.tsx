import { Car, Home, Users, Clock, Trophy, ArrowRight } from 'lucide-react';
import type { Raffle } from '@/lib/supabase';
import { formatPrice, formatNumber } from '@/lib/format';
import Countdown from './Countdown';

type Props = {
  raffle: Raffle;
  soldCount: number;
  onClick: () => void;
  index?: number;
};

export default function RaffleCard({ raffle, soldCount, onClick, index = 0 }: Props) {
  const isClosed = raffle.status === 'closed';
  const progress = Math.min((soldCount / raffle.max_numbers) * 100, 100);
  const remaining = raffle.max_numbers - soldCount;
  const padLength = String(raffle.max_numbers).length;

  return (
    <button
      onClick={onClick}
      className="group text-left w-full animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      <div className="relative overflow-hidden rounded-2xl glass hover:border-gold-400/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gold-500/5">
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={raffle.image_url}
            alt={raffle.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-500 via-ink-500/30 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${
              raffle.category === 'car'
                ? 'bg-black/40 border border-gold-400/20 text-gold-300'
                : 'bg-black/40 border border-white/10 text-gray-300'
            }`}>
              {raffle.category === 'car' ? <Car className="w-3 h-3" /> : <Home className="w-3 h-3" />}
              <span className="uppercase tracking-wider">{raffle.category}</span>
            </div>
          </div>

          {/* Status badge */}
          {isClosed && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-gold-400/30 text-gold-400 text-xs font-medium">
                <Trophy className="w-3 h-3" />
                <span className="uppercase tracking-wider">Closed</span>
              </div>
            </div>
          )}

          {/* Prize value */}
          {!isClosed && raffle.prize_value && (
            <div className="absolute bottom-4 left-4">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Prize Value</div>
              <div className="text-lg font-serif font-semibold text-white">{raffle.prize_value}</div>
            </div>
          )}

          {/* Winner info for closed raffles */}
          {isClosed && raffle.winner_name && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-gold-400/70">Winner</div>
                  <div className="text-sm font-medium text-white truncate">{raffle.winner_name}</div>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-widest text-gold-400/70">Number</div>
                  <div className="text-sm font-mono font-semibold text-gold-400">#{formatNumber(raffle.winner_number || 0, padLength)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="mb-1">
            <span className="text-xs uppercase tracking-widest text-gold-400/70">{raffle.subtitle}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white mb-3 group-hover:text-gold-100 transition-colors">
            {raffle.title}
          </h3>

          {!isClosed ? (
            <>
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {soldCount.toLocaleString()} sold
                  </span>
                  <span className="text-xs text-gray-500">
                    {remaining.toLocaleString()} left
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Per Number</div>
                  <div className="text-xl font-serif font-semibold text-white">{formatPrice(raffle.ticket_price)}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Clock className="w-3 h-3" />
                    <Countdown target={raffle.end_date} compact />
                  </div>
                  <div className="flex items-center gap-1 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Enter Now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Prize Value</div>
                <div className="text-lg font-serif font-semibold text-white">{raffle.prize_value}</div>
              </div>
              <div className="flex items-center gap-1 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all">
                View Details
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
