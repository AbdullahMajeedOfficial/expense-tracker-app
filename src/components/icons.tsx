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
