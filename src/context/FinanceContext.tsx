
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Transaction, 
  Category, 
  Budget, 
  FinanceSummary, 
  CategoryTotal, 
  MonthlyTotals 
} from '@/types/finance';
import { sampleTransactions, sampleCategories, sampleBudgets } from '@/data/sampleData';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  summary: FinanceSummary;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
    incomeByCategory: [],
    expenseByCategory: [],
    monthlyData: [],
    recentTransactions: [],
  });
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadedTransactions = sampleTransactions.map(tx => ({
      ...tx,
      date: new Date(tx.date),
    }));
    
    setTransactions(loadedTransactions);
    setCategories(sampleCategories);
    setBudgets(sampleBudgets);
  }, []);

  // Calculate summary whenever data changes
  useEffect(() => {
    calculateSummary();
  }, [transactions, categories, currentMonth]);

  const calculateSummary = () => {
    // Process all data for charts
    const allMonthlyData = processMonthlyData();
    
    // Get data for current month
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    
    const currentMonthTransactions = transactions.filter(tx => 
      isWithinInterval(new Date(tx.date), { start: startDate, end: endDate })
    );
    
    // Calculate current month totals
    let totalIncome = 0;
    let totalExpense = 0;
    
    currentMonthTransactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    });
    
    // Calculate by category
    const incomeByCategory = calculateByCategory(currentMonthTransactions, 'income');
    const expenseByCategory = calculateByCategory(currentMonthTransactions, 'expense');
    
    // Get recent transactions
    const recentTransactions = transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    setSummary({
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      incomeByCategory,
      expenseByCategory,
      monthlyData: allMonthlyData,
      recentTransactions,
    });
  };

  const processMonthlyData = (): MonthlyTotals[] => {
    const monthlyData: Map<string, MonthlyTotals> = new Map();
    
    // Get distinct months from transactions
    transactions.forEach(tx => {
      const month = format(new Date(tx.date), 'yyyy-MM');
      const existingData = monthlyData.get(month) || { month, income: 0, expense: 0 };
      
      if (tx.type === 'income') {
        existingData.income += tx.amount;
      } else {
        existingData.expense += tx.amount;
      }
      
      monthlyData.set(month, existingData);
    });
    
    // Convert map to array and sort by month
    return Array.from(monthlyData.values())
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const calculateByCategory = (txs: Transaction[], type: 'income' | 'expense'): CategoryTotal[] => {
    const byCategory: Map<string, number> = new Map();
    
    // Group transactions by category
    txs.filter(tx => tx.type === type).forEach(tx => {
      const amount = byCategory.get(tx.category) || 0;
      byCategory.set(tx.category, amount + tx.amount);
    });
    
    // Convert to array with category details
    const result: CategoryTotal[] = [];
    byCategory.forEach((amount, categoryName) => {
      const category = categories.find(c => c.name === categoryName);
      result.push({
        category: categoryName,
        amount,
        color: category?.color || '#64748b',
      });
    });
    
    return result.sort((a, b) => b.amount - a.amount);
  };

  // Transaction methods
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount.toFixed(2)} added successfully.`,
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(tx => 
      tx.id === transaction.id ? transaction : tx
    ));
    toast({
      title: "Transaction updated",
      description: "Transaction updated successfully.",
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
    toast({
      title: "Transaction deleted",
      description: "Transaction removed successfully.",
    });
  };

  // Category methods
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `Category "${category.name}" added successfully.`,
    });
  };

  const updateCategory = (category: Category) => {
    setCategories(categories.map(cat => 
      cat.id === category.id ? category : cat
    ));
    toast({
      title: "Category updated",
      description: `Category "${category.name}" updated successfully.`,
    });
  };

  const deleteCategory = (id: string) => {
    // Check if category is used in transactions
    const isUsed = transactions.some(tx => {
      const category = categories.find(c => c.id === id);
      return tx.category === category?.name;
    });
    
    if (isUsed) {
      toast({
        title: "Cannot delete category",
        description: "This category is used in transactions. Please remove or change those transactions first.",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Category deleted",
      description: "Category removed successfully.",
    });
  };

  // Budget methods
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: uuidv4() };
    setBudgets([...budgets, newBudget]);
    toast({
      title: "Budget added",
      description: `Budget for ${budget.category} added successfully.`,
    });
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(budgets.map(b => 
      b.id === budget.id ? budget : b
    ));
    toast({
      title: "Budget updated",
      description: `Budget for ${budget.category} updated successfully.`,
    });
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    toast({
      title: "Budget deleted",
      description: "Budget removed successfully.",
    });
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      categories,
      budgets,
      summary,
      currentMonth,
      setCurrentMonth,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      addBudget,
      updateBudget,
      deleteBudget,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
