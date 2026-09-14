import { Crown, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-20 pt-16 pb-10 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Crown className="w-5 h-5 text-gold-400" strokeWidth={1.5} />
              <span className="font-serif text-xl font-semibold text-white">Etaye</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Premium raffles for extraordinary prizes. Choose your numbers. Win the extraordinary.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Explore</h4>
            <ul className="space-y-3">
              {['Active Raffles', 'Cars', 'Houses', 'Past Winners'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400 hover:text-gold-400 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer hover:border-gold-400/30 transition-all"
                >
                  <Icon className="w-4 h-4 text-gray-400 hover:text-gold-400 transition-colors" strokeWidth={1.5} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              Licensed and regulated. Play responsibly.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2026 Etaye. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">Terms</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">Privacy</span>
            <span className="text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
