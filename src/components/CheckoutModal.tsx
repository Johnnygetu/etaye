import { useState } from 'react';
import { X, Check, Loader2, Sparkles } from 'lucide-react';
import { supabase, type Raffle } from '@/lib/supabase';
import { formatPrice, formatNumber } from '@/lib/format';

type Props = {
  raffle: Raffle;
  selectedNumbers: number[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function CheckoutModal({ raffle, selectedNumbers, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const padLength = String(raffle.max_numbers).length;
  const total = selectedNumbers.length * raffle.ticket_price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rows = selectedNumbers.map((num) => ({
        raffle_id: raffle.id,
        number: num,
        buyer_name: name.trim(),
        buyer_email: email.trim(),
      }));

      const { error: insertError } = await supabase.from('tickets').insert(rows);

      if (insertError) {
        if (insertError.code === '23505') {
          setError('Some numbers were just taken. Please try different numbers.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />

      <div
        className="relative w-full sm:max-w-lg glass rounded-t-3xl sm:rounded-3xl border-t border-gold-400/10 sm:border max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center animate-scale-in">
              <Check className="w-8 h-8 text-ink-500" strokeWidth={3} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-white mb-2">
              You're In!
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Your numbers have been secured. We'll notify you at <span className="text-gold-400">{email}</span> when the draw happens.
            </p>
            <div className="glass-gold rounded-2xl p-4 inline-block">
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {selectedNumbers.map((n) => (
                  <span
                    key={n}
                    className="px-3 py-1.5 rounded-lg bg-gold-400/10 text-gold-400 text-sm font-mono font-medium"
                  >
                    {formatNumber(n, padLength)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 glass border-b border-white/[0.04] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="font-serif text-lg font-semibold text-white">Confirm Your Entry</h3>
                <p className="text-xs text-gray-500 mt-0.5">{raffle.title}</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Selected numbers */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-xs uppercase tracking-widest text-gold-400/70">
                    Your Numbers ({selectedNumbers.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {selectedNumbers.map((n) => (
                    <span
                      key={n}
                      className="px-3 py-1.5 rounded-lg glass-gold text-gold-400 text-sm font-mono font-medium"
                    >
                      {formatNumber(n, padLength)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/30 transition-colors"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="glass-gold rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {selectedNumbers.length} × {formatPrice(raffle.ticket_price)}
                  </span>
                  <span className="text-gray-300">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/[0.04]">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-gold-400 font-serif text-lg font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-ink-500 font-medium text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-gold-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Securing Numbers...
                  </>
                ) : (
                  `Secure ${selectedNumbers.length} Number${selectedNumbers.length > 1 ? 's' : ''}`
                )}
              </button>

              <p className="text-xs text-gray-600 text-center">
                By entering, you agree to Etaye's terms and raffle rules.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
