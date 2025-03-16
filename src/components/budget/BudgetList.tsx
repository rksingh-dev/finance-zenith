
import React, { useState } from 'react';
import { Budget } from '@/types/finance';
import { useFinance } from '@/context/FinanceContext';
import { Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BudgetForm } from './BudgetForm';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, spent, onEdit, onDelete }) => {
  const percentUsed = Math.min(100, Math.round((spent / budget.amount) * 100));
  const remaining = Math.max(0, budget.amount - spent);

  let progressColor = 'bg-finance-primary';
  if (percentUsed > 85) {
    progressColor = 'bg-finance-negative';
  } else if (percentUsed > 70) {
    progressColor = 'bg-finance-warning';
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">{budget.category}</CardTitle>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(budget.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>
              {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
            </span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(budget.amount)}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Used</span>
              <span>{percentUsed}%</span>
            </div>
            <Progress value={percentUsed} className={progressColor} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Remaining</span>
            <span className={`font-medium ${remaining === 0 ? 'text-finance-negative' : ''}`}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(remaining)}
            </span>
          </div>

          {percentUsed >= 85 && (
            <div className="flex items-center text-xs text-finance-negative mt-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>
                {percentUsed >= 100 ? 'Budget exceeded!' : 'Approaching budget limit!'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface BudgetListProps {
  budgets: Budget[];
}

export const BudgetList: React.FC<BudgetListProps> = ({ budgets }) => {
  const { transactions, deleteBudget, currentMonth } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  const handleAddBudget = () => {
    setEditBudget(undefined);
    setIsFormOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setBudgetToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  // Calculate spent amount for each budget
  const budgetsWithSpending = budgets.map(budget => {
    // Filter transactions for current month and matching category
    const categoryTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const monthMatch = txDate.getMonth() === currentMonth.getMonth() && 
                         txDate.getFullYear() === currentMonth.getFullYear();
      
      return monthMatch && tx.category === budget.category && tx.type === 'expense';
    });
    
    // Sum up the amounts
    const spent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    return {
      budget,
      spent
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <Button onClick={handleAddBudget}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {budgetsWithSpending.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
          <p className="text-gray-500 dark:text-gray-400">
            No budgets created yet. Add your first budget to track spending.
          </p>
          <Button className="mt-4" onClick={handleAddBudget}>
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetsWithSpending.map(({ budget, spent }) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={spent}
              onEdit={handleEditBudget}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <BudgetForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        budget={editBudget}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
