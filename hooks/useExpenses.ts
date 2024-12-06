import { useState, useEffect } from 'react';
import { Expense } from '@/lib/types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId = {
      ...newExpense,
      id: Date.now().toString(),
    };
    const updatedExpenses = [...expenses, expenseWithId];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const getTotalBalance = () => {
    return expenses.reduce((total, expense) => {
      switch (expense.type) {
        case 'income':
          return total + expense.amount;
        case 'expense':
          return total - expense.amount;
        case 'lend':
          return total - expense.amount;
        case 'borrow':
          return total + expense.amount;
        default:
          return total;
      }
    }, 0);
  };

  const getDailyExpenses = () => {
    const dailyExpenses: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date).toDateString();
      if (expense.type === 'expense') {
        dailyExpenses[date] = (dailyExpenses[date] || 0) + expense.amount;
      }
    });
    return dailyExpenses;
  };

  const getPersonTransactions = () => {
    const personTransactions: { [key: string]: Expense[] } = {};
    expenses.forEach((expense) => {
      if (expense.type === 'lend' || expense.type === 'borrow') {
        if (expense.person) {
          if (!personTransactions[expense.person]) {
            personTransactions[expense.person] = [];
          }
          personTransactions[expense.person].push(expense);
        }
      }
    });
    return personTransactions;
  };

  return { expenses, addExpense, deleteExpense, getTotalBalance, getDailyExpenses, getPersonTransactions };
}

