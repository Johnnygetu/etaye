import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import RaffleDetailPage from '@/pages/RaffleDetailPage';
import type { Raffle } from '@/lib/supabase';

type Page = 'home' | 'detail';
type Filter = 'all' | 'car' | 'house' | 'closed';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);

  const handleRaffleClick = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBack = () => {
    setPage('home');
    setSelectedRaffle(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateHome = () => {
    setPage('home');
    setSelectedRaffle(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <div className="min-h-screen bg-ink-500 flex flex-col">
      <Header
        onNavigate={handleNavigateHome}
        onCategoryFilter={setFilter}
        activeFilter={filter}
      />

      <main className="flex-1">
        {page === 'home' && (
          <HomePage
            filter={filter}
            onFilterChange={setFilter}
            onRaffleClick={handleRaffleClick}
          />
        )}
        {page === 'detail' && selectedRaffle && (
          <RaffleDetailPage raffle={selectedRaffle} onBack={handleBack} />
        )}
      </main>

      <Footer />
    </div>
  );
}
