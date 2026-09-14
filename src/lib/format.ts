export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatNumber(num: number, pad: number = 4): string {
  return String(num).padStart(pad, '0');
}

export function getSoldCount(tickets: { number: number }[]): number {
  return tickets.length;
}

export function getProgress(sold: number, max: number): number {
  if (max === 0) return 0;
  return Math.min((sold / max) * 100, 100);
}
