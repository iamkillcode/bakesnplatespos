
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

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
});

function AddProductForm({ onProductAdded }: { onProductAdded: (product: any) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0 },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const newProduct = {
      id: `PROD${String(initialProducts.length + 1).padStart(3, '0')}`,
      name: values.name,
      price: values.price,
    };
    onProductAdded(newProduct);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new product</DialogTitle>
          <DialogDescription>
            Enter the details of the new product below.
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
                    <Input placeholder="e.g. Croissant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (GH₵)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Product</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function ProductsPage() {
    const [products, setProducts] = useState(initialProducts);

    const handleAddProduct = (product: any) => {
        setProducts(prev => [...prev, product]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Products</h1>
                <AddProductForm onProductAdded={handleAddProduct} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Product List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-right">GH₵{product.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
