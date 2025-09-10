
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

const initialCustomers = [
    { id: 'CUS001', name: 'John Doe', phone: '555-0101', totalOrders: 5, totalSpent: '$450.20' },
    { id: 'CUS002', name: 'Jane Smith', phone: '555-0102', totalOrders: 2, totalSpent: '$95.50' },
    { id: 'CUS003', name: 'Bob Johnson', phone: '555-0103', totalOrders: 8, totalSpent: '$1205.00' },
    { id: 'CUS004', name: 'Alice Williams', phone: '555-0104', totalOrders: 12, totalSpent: '$780.25' },
    { id: 'CUS005', name: 'Charlie Brown', phone: '555-0105', totalOrders: 1, totalSpent: '$99.99' },
];

const ADD_NEW_CUSTOMER_VALUE = 'add_new_customer';

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  newCustomerName: z.string().optional(),
  total: z.coerce.number().min(0.01, "Total must be a positive number"),
  status: z.enum(['Completed', 'Pending', 'In Progress', 'Cancelled']),
}).refine(data => {
    if (data.customerId === ADD_NEW_CUSTOMER_VALUE) {
        return !!data.newCustomerName && data.newCustomerName.length > 0;
    }
    return true;
}, {
    message: "New customer name is required",
    path: ["newCustomerName"],
});


function NewOrderForm({ customers: initialCustomers, onOrderAdded, onCustomerAdded }: { customers: any[], onOrderAdded: (order: any) => void, onCustomerAdded: (customer: any) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerId: "", newCustomerName: "", total: 0, status: "Pending" },
  });

  const customerId = form.watch("customerId");

  const onSubmit = (values: z.infer<typeof orderSchema>) => {
    let customerName = "";
    if (values.customerId === ADD_NEW_CUSTOMER_VALUE) {
        customerName = values.newCustomerName!;
        const newCustomer = {
          id: `CUS${String(initialCustomers.length + 1).padStart(3, '0')}`,
          name: customerName,
          phone: 'N/A',
          totalOrders: 1,
          totalSpent: `$${values.total.toFixed(2)}`
        };
        onCustomerAdded(newCustomer);
    } else {
        const existingCustomer = initialCustomers.find(c => c.id === values.customerId);
        customerName = existingCustomer?.name || 'Unknown';
    }

    const newOrder = {
      id: `ORD${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      customer: customerName,
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
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an existing customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {initialCustomers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                      <SelectItem value={ADD_NEW_CUSTOMER_VALUE}>
                        <span className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add New Customer
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {customerId === ADD_NEW_CUSTOMER_VALUE && (
                 <FormField
                    control={form.control}
                    name="newCustomerName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>New Customer Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Emily White" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
            )}
            
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
    // In a real app, this would be shared state or fetched from a service
    const [customers, setCustomers] = useState(initialCustomers);
    
    const handleAddOrder = (order: any) => {
        setOrders(prev => [order, ...prev]);
    };

    const handleAddCustomer = (customer: any) => {
        setCustomers(prev => [...prev, customer]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Orders</h1>
                <NewOrderForm customers={customers} onOrderAdded={handleAddOrder} onCustomerAdded={handleAddCustomer} />
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
