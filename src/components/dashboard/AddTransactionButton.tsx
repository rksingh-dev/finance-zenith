
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TransactionForm } from '@/components/transactions/TransactionForm';

export const AddTransactionButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsFormOpen(true)} className="bg-finance-secondary hover:bg-finance-secondary/90">
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
      <TransactionForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
};
