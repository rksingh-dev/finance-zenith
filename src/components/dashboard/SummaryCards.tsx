
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  trend?: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon, 
  className,
  trend
}) => {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", className)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        
        {trend !== undefined && (
          <div className="flex items-center mt-1">
            <span className={trend >= 0 
              ? "text-finance-positive flex items-center" 
              : "text-finance-negative flex items-center"
            }>
              {trend >= 0 
                ? <ArrowUpRight className="w-4 h-4 mr-1" /> 
                : <ArrowDownRight className="w-4 h-4 mr-1" />
              }
              {Math.abs(trend).toFixed(1)}%
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  incomeTrend?: number;
  expensesTrend?: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  income,
  expenses,
  balance,
  incomeTrend = 5.2,
  expensesTrend = -2.4
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Income"
        value={income}
        trend={incomeTrend}
        icon={<DollarSign className="w-5 h-5 text-finance-positive" />}
        className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30"
      />
      <SummaryCard
        title="Total Expenses"
        value={expenses}
        trend={expensesTrend}
        icon={<CreditCard className="w-5 h-5 text-finance-negative" />}
        className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
      />
      <SummaryCard
        title="Current Balance"
        value={balance}
        icon={<DollarSign className="w-5 h-5 text-finance-primary" />}
        className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30"
      />
    </div>
  );
};
