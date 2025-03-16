
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFinance } from '@/context/FinanceContext';
import { Budget } from '@/types/finance';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  category: z.string({
    required_error: 'Category is required',
  }),
  amount: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    }).positive('Amount must be positive')
  ),
  period: z.enum(['monthly', 'weekly', 'yearly'], {
    required_error: 'Period is required',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  open,
  onOpenChange,
  budget,
}) => {
  const { categories, addBudget, updateBudget } = useFinance();
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: budget
      ? {
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
        }
      : {
          category: '',
          amount: undefined,
          period: 'monthly',
        },
  });

  const onSubmit = (values: FormValues) => {
    // Ensure all required fields are present before submitting
    const budgetData: Omit<Budget, 'id'> = {
      category: values.category,
      amount: values.amount as number, // We know it's a number from our schema validation
      period: values.period,
    };
    
    if (budget) {
      updateBudget({
        ...budget,
        ...budgetData,
      });
    } else {
      addBudget(budgetData);
    }
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? 'Edit Budget' : 'Add Budget'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.length > 0 ? (
                        expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          No expense categories found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        placeholder="0.00"
                        {...field}
                        value={field.value || ''}
                        className="pl-8"
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {budget ? 'Update' : 'Add'} Budget
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
