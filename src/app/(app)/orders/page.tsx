
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { RecentOrdersTable } from "../RecentOrdersTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const orderSchema = z.object({
  customer: z.string().min(1, "Customer name is required"),
  total: z.coerce.number().min(0.01, "Total must be a positive number"),
  status: z.enum(['Completed', 'Pending', 'In Progress', 'Cancelled']),
});


function NewOrderForm({ onOrderAdded }: { onOrderAdded: (order: any) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { customer: "", total: 0, status: "Pending" },
  });

  const onSubmit = (values: z.infer<typeof orderSchema>) => {
    const newOrder = {
      id: `ORD${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      customer: values.customer,
      date: format(new Date(), 'yyyy-MM-dd'),
      total: `$${values.total.toFixed(2)}`,
      status: values.status,
    };
    onOrderAdded(newOrder);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Order</DialogTitle>
          <DialogDescription>
            Enter the details for the new order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="45.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Order</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function OrdersPage() {
    const [orders, setOrders] = useState([
        { id: 'ORD001', customer: 'John Doe', date: '2023-11-20', total: '$150.00', status: 'Completed' },
        { id: 'ORD002', customer: 'Jane Smith', date: '2023-11-21', total: '$45.50', status: 'Pending' },
        { id: 'ORD003', customer: 'Bob Johnson', date: '2023-11-21', total: '$205.00', status: 'In Progress' },
        { id: 'ORD004', customer: 'Alice Williams', date: '2023-11-22', total: '$78.25', status: 'Completed' },
        { id: 'ORD005', customer: 'Charlie Brown', date: '2023-11-23', total: '$99.99', status: 'Cancelled' },
    ]);
    
    const handleAddOrder = (order: any) => {
        setOrders(prev => [order, ...prev]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Orders</h1>
                <NewOrderForm onOrderAdded={handleAddOrder} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <RecentOrdersTable orders={orders} />
                </CardContent>
            </Card>
        </div>
    );
}
