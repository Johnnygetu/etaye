import { Trophy, Crown, Sparkles } from 'lucide-react';
import type { Raffle } from '@/lib/supabase';
import { formatNumber, formatDate } from '@/lib/format';

type Props = {
  raffle: Raffle;
};

export default function WinnerBanner({ raffle }: Props) {
  if (!raffle.winner_name) return null;

  const padLength = String(raffle.max_numbers).length;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-gold p-8 sm:p-12 animate-scale-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20">
            <Trophy className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-400 font-medium">
              Raffle Closed
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
          {/* Trophy icon */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center shadow-xl shadow-gold-500/20">
              <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-ink-500" strokeWidth={1.5} />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-gold-300 animate-glow" />
          </div>

          {/* Winner info */}
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-gold-400/70 mb-1">
              Winner
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mb-3">
              {raffle.winner_name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Winning Number
                </div>
                <div className="text-2xl font-mono font-bold text-gold-400">
                  #{formatNumber(raffle.winner_number || 0, padLength)}
                </div>
              </div>
              <div className="w-px h-10 bg-white/[0.06] hidden sm:block" />
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Drawn On
                </div>
                <div className="text-sm text-gray-300">
                  {formatDate(raffle.draw_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 pt-6 border-t border-white/[0.04]">
          <p className="text-sm text-gray-400 leading-relaxed">
            Congratulations to our winner! The {raffle.title} has been awarded.
            Stay tuned for more extraordinary raffles — your number could be next.
          </p>
        </div>
      </div>
    </div>
  );
}
