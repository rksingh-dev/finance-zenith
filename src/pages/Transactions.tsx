
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TransactionForm } from '@/components/transactions/TransactionForm';

const Transactions = () => {
  const { transactions } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button onClick={() => setIsFormOpen(true)} className="bg-finance-secondary hover:bg-finance-secondary/90 mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <TransactionList transactions={transactions} />
        <TransactionForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      </div>
    </Layout>
  );
};

export default Transactions;
