

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { RecentOrdersTable } from "../(auth)/RecentOrdersTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessData } from '@/hooks/use-business-data';

const ADD_NEW_CUSTOMER_VALUE = 'add_new_customer';

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  newCustomerName: z.string().optional(),
  products: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  })).min(1, "At least one product is required"),
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

type OrderFormValues = z.infer<typeof orderSchema>;

function NewOrderForm({ onOrderAdded }: { onOrderAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const { customers, products, addCustomer, addOrder, loading } = useBusinessData();
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { 
        customerId: "", 
        newCustomerName: "", 
        products: [{ productId: '', quantity: 1 }], 
        adjustment: 0, 
        status: "Pending" 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const customerId = form.watch("customerId");
  const formProducts = form.watch("products");
  const adjustment = form.watch("adjustment");

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const subtotal = formProducts.reduce((acc, item) => {
        const selectedProduct = products.find(p => p.id === item.productId);
        const price = selectedProduct?.price || 0;
        return acc + (price * (item.quantity || 1));
    }, 0);
    const newTotal = subtotal + adjustment;
    setTotal(newTotal);
  }, [formProducts, adjustment, products]);

  const onSubmit = async (values: OrderFormValues) => {
    let customerName = "";
    let custId = values.customerId;

    if (values.customerId === ADD_NEW_CUSTOMER_VALUE) {
        customerName = values.newCustomerName!;
        const newCustomer = await addCustomer({ name: customerName, phone: 'N/A' });
        custId = newCustomer.id;
        customerName = newCustomer.name;
    } else {
        const existingCustomer = customers.find(c => c.id === values.customerId);
        customerName = existingCustomer?.name || 'Unknown';
    }

    const productDetails = values.products.map(p => {
        const productInfo = products.find(prod => prod.id === p.productId);
        return `${productInfo?.name} (x${p.quantity})`;
    }).join(', ');

    await addOrder({
        customer: customerName,
        product: productDetails,
        total: `GH₵${total.toFixed(2)}`,
        status: values.status,
    });

    onOrderAdded();
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
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a New Order</DialogTitle>
          <DialogDescription>
            Select products and a customer to create a new order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
            { loading ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> : <>
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
                      {customers.map(customer => (
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
            
            <div>
              <FormLabel>Products</FormLabel>
              <div className="space-y-2 pt-2">
                {fields.map((item, index) => (
                   <div key={item.id} className="flex flex-col sm:flex-row gap-2 items-end">
                      <FormField
                          control={form.control}
                          name={`products.${index}.productId`}
                          render={({ field }) => (
                              <FormItem className="flex-1 w-full">
                                  <FormLabel className="sm:hidden text-xs">Product</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a product" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          {products.map(product => (
                                              <SelectItem key={product.id} value={product.id}>
                                                  {product.name} (GH₵{product.price.toFixed(2)})
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name={`products.${index}.quantity`}
                          render={({ field }) => (
                              <FormItem className="w-full sm:w-24">
                                   <FormLabel className="sm:hidden text-xs">Quantity</FormLabel>
                                  <FormControl>
                                      <Input type="number" placeholder="Qty" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                       />
                       <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1} className="w-full sm:w-10">
                           <Trash2 className="h-4 w-4" />
                            <span className="sm:hidden ml-2">Remove</span>
                       </Button>
                   </div>
                ))}
              </div>
               <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ productId: '', quantity: 1 })}>
                   <PlusCircle className="mr-2 h-4 w-4" /> Add Product
               </Button>
            </div>


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
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Order
            </Button>
            </> }
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function OrdersPage() {
    const { orders, loading, updateOrderStatus, refetch } = useBusinessData();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-headline">Orders</h1>
                <NewOrderForm onOrderAdded={refetch} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                    <RecentOrdersTable orders={orders} onUpdateOrder={updateOrderStatus} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
