
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { SpendingByCategoryChart } from '@/components/dashboard/SpendingByCategoryChart';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { AddTransactionButton } from '@/components/dashboard/AddTransactionButton';

const Dashboard = () => {
  const { summary, currentMonth, setCurrentMonth } = useFinance();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-3">
          <MonthPicker date={currentMonth} onDateChange={setCurrentMonth} />
          <AddTransactionButton />
        </div>
      </div>

      <SummaryCards
        income={summary.totalIncome}
        expenses={summary.totalExpense}
        balance={summary.netAmount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart data={summary.monthlyData} />
        <SpendingByCategoryChart data={summary.expenseByCategory} />
      </div>

      <RecentTransactions transactions={summary.recentTransactions} />
    </div>
  );
};

export default Dashboard;
