
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBusinessData } from "@/hooks/use-business-data";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
});

function AddCustomerForm({ onCustomerAdded }: { onCustomerAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const { addCustomer } = useBusinessData();
  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubmit = (values: z.infer<typeof customerSchema>) => {
    addCustomer(values);
    onCustomerAdded();
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new customer</DialogTitle>
          <DialogDescription>
            Enter the details of the new customer below.
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
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="555-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Customer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function CustomersPage() {
    const { customers, orders } = useBusinessData();
    const [version, setVersion] = useState(0);

    const getCustomerStats = (customerName: string) => {
        const customerOrders = orders.filter(o => o.customer === customerName);
        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, order) => {
            return sum + parseFloat(order.total.replace('GH₵', ''));
        }, 0);
        return {
            totalOrders,
            totalSpent: `GH₵${totalSpent.toFixed(2)}`
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Customers</h1>
                <AddCustomerForm onCustomerAdded={() => setVersion(v => v + 1)} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Total Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => {
                                const stats = getCustomerStats(customer.name);
                                return (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{stats.totalOrders}</TableCell>
                                        <TableCell>{stats.totalSpent}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
