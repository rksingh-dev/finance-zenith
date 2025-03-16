
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { BudgetList } from '@/components/budget/BudgetList';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { BudgetForm } from '@/components/budget/BudgetForm';

const Budget = () => {
  const { budgets } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <Button onClick={() => setIsFormOpen(true)} className="bg-finance-secondary hover:bg-finance-secondary/90 mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>

        <BudgetList budgets={budgets} />
        <BudgetForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      </div>
    </Layout>
  );
};

export default Budget;
