
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ExpenseByCategory } from '@/components/reports/ExpenseByCategory';
import { MonthlyTrendsChart } from '@/components/reports/MonthlyTrendsChart';
import { useFinance } from '@/context/FinanceContext';

const Reports = () => {
  const { summary } = useFinance();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExpenseByCategory data={summary.expenseByCategory} />
          <MonthlyTrendsChart data={summary.monthlyData} />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
