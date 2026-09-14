import { useState } from 'react';
import { Menu, X, Crown } from 'lucide-react';

type Props = {
  onNavigate: (page: 'home') => void;
  onCategoryFilter: (category: 'all' | 'car' | 'house' | 'closed') => void;
  activeFilter: 'all' | 'car' | 'house' | 'closed';
};

export default function Header({ onNavigate, onCategoryFilter, activeFilter }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (filter: 'all' | 'car' | 'house' | 'closed') => {
    onCategoryFilter(filter);
    onNavigate('home');
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass py-3 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => handleNav('all')}
          className="flex items-center gap-2.5 group"
        >
          <Crown className="w-6 h-6 text-gold-400 group-hover:text-gold-300 transition-colors" strokeWidth={1.5} />
          <span className="font-serif text-2xl font-semibold text-white tracking-wide">
            Etaye
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'All', value: 'all' as const },
            { label: 'Cars', value: 'car' as const },
            { label: 'Houses', value: 'house' as const },
            { label: 'Winners', value: 'closed' as const },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handleNav(item.value)}
              className={`text-sm font-medium tracking-wide transition-colors relative group ${
                activeFilter === item.value ? 'text-gold-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 right-0 h-px bg-gold-400 transition-transform duration-300 ${
                  activeFilter === item.value ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
          ))}
        </nav>

        <button
          className="md:hidden text-gray-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass mt-3 mx-4 rounded-2xl overflow-hidden animate-scale-in">
          <nav className="flex flex-col py-2">
            {[
              { label: 'All Raffles', value: 'all' as const },
              { label: 'Cars', value: 'car' as const },
              { label: 'Houses', value: 'house' as const },
              { label: 'Winners', value: 'closed' as const },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`px-6 py-4 text-left text-sm font-medium transition-colors ${
                  activeFilter === item.value ? 'text-gold-400 bg-white/[0.03]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
