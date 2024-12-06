export type ExpenseType = 'expense' | 'income' | 'lend' | 'borrow';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: ExpenseType;
  category: string;
  person?: string; // New field for person involved in lending/borrowing
}

