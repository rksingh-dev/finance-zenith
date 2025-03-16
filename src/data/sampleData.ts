
import { Transaction, Category, Budget } from '@/types/finance';
import { format } from 'date-fns';

export const sampleCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#10b981' },
  { id: '2', name: 'Freelance', type: 'income', color: '#3b82f6' },
  { id: '3', name: 'Investments', type: 'income', color: '#8b5cf6' },
  { id: '4', name: 'Other Income', type: 'income', color: '#06b6d4' },
  
  { id: '5', name: 'Housing', type: 'expense', color: '#ef4444' },
  { id: '6', name: 'Food', type: 'expense', color: '#f59e0b' },
  { id: '7', name: 'Transportation', type: 'expense', color: '#6366f1' },
  { id: '8', name: 'Utilities', type: 'expense', color: '#64748b' },
  { id: '9', name: 'Entertainment', type: 'expense', color: '#ec4899' },
  { id: '10', name: 'Healthcare', type: 'expense', color: '#14b8a6' },
  { id: '11', name: 'Shopping', type: 'expense', color: '#f97316' },
  { id: '12', name: 'Education', type: 'expense', color: '#8b5cf6' },
];

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 5);
  
  // Generate transactions for last 6 months
  while (startDate <= today) {
    // Add income transactions for the month
    transactions.push({
      id: `income-${format(startDate, 'yyyyMM')}-1`,
      date: new Date(startDate),
      amount: 3500 + Math.random() * 500,
      category: 'Salary',
      description: 'Monthly salary',
      type: 'income'
    });
    
    if (Math.random() > 0.6) {
      transactions.push({
        id: `income-${format(startDate, 'yyyyMM')}-2`,
        date: new Date(startDate.getTime() + 86400000 * 3),
        amount: 200 + Math.random() * 800,
        category: 'Freelance',
        description: 'Freelance project',
        type: 'income'
      });
    }
    
    // Add fixed expense transactions
    transactions.push({
      id: `expense-${format(startDate, 'yyyyMM')}-1`,
      date: new Date(startDate.getTime() + 86400000 * 2),
      amount: 1200 + Math.random() * 100,
      category: 'Housing',
      description: 'Monthly rent',
      type: 'expense'
    });
    
    transactions.push({
      id: `expense-${format(startDate, 'yyyyMM')}-2`,
      date: new Date(startDate.getTime() + 86400000 * 5),
      amount: 200 + Math.random() * 50,
      category: 'Utilities',
      description: 'Electricity and water',
      type: 'expense'
    });
    
    // Add variable expenses
    for (let i = 0; i < 10; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(startDate);
      date.setDate(day);
      
      const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      let amount = 0;
      switch (category) {
        case 'Food':
          amount = 10 + Math.random() * 90;
          break;
        case 'Transportation':
          amount = 20 + Math.random() * 50;
          break;
        case 'Entertainment':
          amount = 30 + Math.random() * 70;
          break;
        case 'Shopping':
          amount = 50 + Math.random() * 200;
          break;
        case 'Healthcare':
          amount = 100 + Math.random() * 300;
          break;
      }
      
      transactions.push({
        id: `expense-${format(startDate, 'yyyyMM')}-${i + 3}`,
        date: date,
        amount: amount,
        category: category,
        description: `${category} expense`,
        type: 'expense'
      });
    }
    
    // Move to next month
    startDate.setMonth(startDate.getMonth() + 1);
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const sampleTransactions: Transaction[] = generateTransactions();

export const sampleBudgets: Budget[] = [
  { id: '1', category: 'Housing', amount: 1500, period: 'monthly' },
  { id: '2', category: 'Food', amount: 600, period: 'monthly' },
  { id: '3', category: 'Transportation', amount: 200, period: 'monthly' },
  { id: '4', category: 'Entertainment', amount: 300, period: 'monthly' },
  { id: '5', category: 'Utilities', amount: 250, period: 'monthly' },
  { id: '6', category: 'Shopping', amount: 400, period: 'monthly' },
  { id: '7', category: 'Healthcare', amount: 200, period: 'monthly' },
];
