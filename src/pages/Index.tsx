
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { SpendingByCategoryChart } from '@/components/dashboard/SpendingByCategoryChart';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { BudgetList } from '@/components/budget/BudgetList';
import { AddTransactionButton } from '@/components/dashboard/AddTransactionButton';
import { useFinance } from '@/context/FinanceContext';

const Index = () => {
  const { 
    summary, 
    currentMonth, 
    setCurrentMonth,
    budgets 
  } = useFinance();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <MonthPicker date={currentMonth} onDateChange={setCurrentMonth} />
            <AddTransactionButton />
          </div>
        </div>

        <SummaryCards 
          income={summary.totalIncome} 
          expenses={summary.totalExpense} 
          balance={summary.netAmount} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <IncomeExpenseChart data={summary.monthlyData} />
          <SpendingByCategoryChart data={summary.expenseByCategory} />
        </div>

        <div className="mt-8">
          <RecentTransactions transactions={summary.recentTransactions} />
        </div>

        <div className="mt-8">
          <BudgetList budgets={budgets} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
