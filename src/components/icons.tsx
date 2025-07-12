import { Utensils, Car, Home, Receipt, Shirt, Clapperboard, Landmark, TrendingUp, HelpCircle } from 'lucide-react';

export const categoryIcons = {
  'Food': Utensils,
  'Transport': Car,
  'Utilities': Home,
  'Rent': Home,
  'Bills': Receipt,
  'Shopping': Shirt,
  'Entertainment': Clapperboard,
  'Salary': Landmark,
  'Investments': TrendingUp,
  'Other': HelpCircle,
};

export const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || HelpCircle;
};

// This icon is no longer used, but keeping it in case it's needed elsewhere.
export const RupeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h8a6 6 0 0 1 0 12H9l3 3"/>
        <path d="M6 21h12"/>
        <path d="M6 12H4"/>
    </svg>
);
