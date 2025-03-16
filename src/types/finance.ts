
export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface MonthlyTotals {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  incomeByCategory: CategoryTotal[];
  expenseByCategory: CategoryTotal[];
  monthlyData: MonthlyTotals[];
  recentTransactions: Transaction[];
}
