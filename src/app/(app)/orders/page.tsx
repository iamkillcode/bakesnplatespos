
'use client';

import { useState, useEffect } from 'react';
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
    { id: 'CUS001', name: 'John Doe' },
    { id: 'CUS002', name: 'Jane Smith' },
    { id: 'CUS003', name: 'Bob Johnson' },
];

const initialProducts = [
    { id: 'PROD001', name: 'Bento Cake', price: 150.00 },
    { id: 'PROD002', name: 'Cupcakes (2)', price: 30.00 },
    { id: 'PROD003', name: 'Cupcakes (4)', price: 55.00 },
    { id: 'PROD004', name: 'Cupcakes (8)', price: 100.00 },
    { id: 'PROD005', name: 'Cupcakes (12)', price: 140.00 },
    { id: 'PROD006', name: '6" Cake', price: 250.00 },
    { id: 'PROD007', name: '8" Cake', price: 350.00 },
    { id: 'PROD008', name: '10" Cake', price: 450.00 },
    { id: 'PROD009', name: '12" Cake', price: 550.00 },
    { id: 'PROD010', name: 'Doughnuts (2)', price: 25.00 },
    { id: 'PROD011', name: 'Doughnuts (4)', price: 45.00 },
    { id: 'PROD012', name: 'Doughnuts (6)', price: 65.00 },
    { id: 'PROD013', name: 'Doughnuts (8)', price: 85.00 },
    { id: 'PROD014', name: 'Doughnuts (10)', price: 100.00 },
    { id: 'PROD015', name: 'Doughnuts (12)', price: 120.00 },
    { id: 'PROD016', name: 'Sausage Roll', price: 15.00 },
    { id: 'PROD017', name: 'Sobolo Juice', price: 20.00 },
    { id: 'PROD018', name: 'Fruit Juice', price: 25.00 },
];


const ADD_NEW_CUSTOMER_VALUE = 'add_new_customer';

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  newCustomerName: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
  adjustment: z.coerce.number().default(0),
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


function NewOrderForm({ customers: customersProp, products: productsProp, onOrderAdded, onCustomerAdded }: { customers: any[], products: any[], onOrderAdded: (order: any) => void, onCustomerAdded: (customer: any) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerId: "", newCustomerName: "", productId: "", adjustment: 0, status: "Pending" },
  });

  const customerId = form.watch("customerId");
  const productId = form.watch("productId");
  const adjustment = form.watch("adjustment");

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const selectedProduct = productsProp.find(p => p.id === productId);
    const productPrice = selectedProduct?.price || 0;
    const newTotal = productPrice + adjustment;
    setTotal(newTotal);
  }, [productId, adjustment, productsProp]);


  const onSubmit = (values: z.infer<typeof orderSchema>) => {
    let customerName = "";
    if (values.customerId === ADD_NEW_CUSTOMER_VALUE) {
        customerName = values.newCustomerName!;
        const newCustomer = {
          id: `CUS${String(customersProp.length + 1).padStart(3, '0')}`,
          name: customerName,
        };
        onCustomerAdded(newCustomer);
    } else {
        const existingCustomer = customersProp.find(c => c.id === values.customerId);
        customerName = existingCustomer?.name || 'Unknown';
    }

    const selectedProduct = productsProp.find(p => p.id === values.productId);

    const newOrder = {
      id: `ORD${String(Math.floor(Math.random() * 900) + 100)}`,
      customer: customerName,
      product: selectedProduct?.name || 'N/A',
      date: format(new Date(), 'yyyy-MM-dd'),
      total: `GH₵${total.toFixed(2)}`,
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
            Select a product and customer to create a new order.
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
                      {customersProp.map(customer => (
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
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productsProp.map(product => (
                        <SelectItem key={product.id} value={product.id}>{product.name} (GH₵{product.price.toFixed(2)})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adjustment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (-ve) / Markup (+ve) in GH₵</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. -10 for discount, 5 for markup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="font-bold text-lg">
                Total: GH₵{total.toFixed(2)}
            </div>

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
        { id: 'ORD001', customer: 'John Doe', product: 'Bento Cake', date: '2023-11-20', total: 'GH₵150.00', status: 'Completed' },
        { id: 'ORD002', customer: 'Jane Smith', product: 'Cupcakes (4)', date: '2023-11-21', total: 'GH₵55.00', status: 'Pending' },
        { id: 'ORD003', customer: 'Bob Johnson', product: '8" Cake', date: '2023-11-21', total: 'GH₵350.00', status: 'In Progress' },
    ]);
    
    // In a real app, this would be shared state or fetched from a service
    const [customers, setCustomers] = useState(initialCustomers);
    const [products, setProducts] = useState(initialProducts);
    
    const handleAddOrder = (order: any) => {
        setOrders(prev => [order, ...prev]);
    };

    const handleAddCustomer = (customer: any) => {
        setCustomers(prev => [...prev, customer]);
    };

    const handleUpdateOrder = (orderId: string, newStatus: string) => {
        setOrders(currentOrders =>
            currentOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Orders</h1>
                <NewOrderForm customers={customers} products={products} onOrderAdded={handleAddOrder} onCustomerAdded={handleAddCustomer} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <RecentOrdersTable orders={orders} onUpdateOrder={handleUpdateOrder} />
                </CardContent>
            </Card>
        </div>
    );
}
