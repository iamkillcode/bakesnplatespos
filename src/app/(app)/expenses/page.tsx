

'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBusinessData, Expense } from "@/hooks/use-business-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is required"),
  cost: z.coerce.number().min(0.01, "Cost must be a positive number"),
});

function ExpenseForm({ onFormSubmit, initialValues, isEdit = false }: {
  onFormSubmit: (values: z.infer<typeof expenseSchema>) => Promise<void>,
  initialValues?: z.infer<typeof expenseSchema>,
  isEdit?: boolean
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialValues || { name: "", cost: 0 },
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    await onFormSubmit(values);
    if (!isEdit) {
      form.reset();
    }
    setOpen(false);
  };
  
  useState(() => {
    if (initialValues) form.reset(initialValues);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense" : "Add a New Expense"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details of the expense below." : "Enter the details of the new expense below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electricity Bill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost (GH₵)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="150.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Expense"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ExpensesPage() {
    const { expenses, loading, refetch, addExpense, updateExpense, deleteExpense } = useBusinessData();

    const handleAddExpense = async (values: z.infer<typeof expenseSchema>) => {
        await addExpense(values);
        refetch();
    };

    const handleUpdateExpense = async (expenseId: string, values: z.infer<typeof expenseSchema>) => {
        await updateExpense(expenseId, values);
        refetch();
    };

    const handleDeleteExpense = async (expenseId: string) => {
        await deleteExpense(expenseId);
        refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Expenses</h1>
                <ExpenseForm 
                    onFormSubmit={handleAddExpense}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Expense List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Expense Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-medium">{expense.name}</TableCell>
                                     <TableCell>{format(new Date(expense.date), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>GH₵{expense.cost.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <ExpenseForm 
                                                        onFormSubmit={(values) => handleUpdateExpense(expense.id, values)}
                                                        initialValues={expense}
                                                        isEdit={true}
                                                    />
                                                     <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the expense record.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)} className="bg-destructive hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    
