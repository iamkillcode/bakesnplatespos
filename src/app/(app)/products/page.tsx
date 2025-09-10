

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
import { useBusinessData, Product } from "@/hooks/use-business-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
});

function ProductForm({ onFormSubmit, initialValues, buttonLabel, dialogTitle, dialogDescription }: {
  onFormSubmit: (values: z.infer<typeof productSchema>) => Promise<void>,
  initialValues?: z.infer<typeof productSchema>,
  buttonLabel: React.ReactNode,
  dialogTitle: string,
  dialogDescription: string
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || { name: "", price: 0 },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    await onFormSubmit(values);
    form.reset();
    setOpen(false);
  };
  
  // When initialValues change (e.g. user clicks edit on another item), reset the form
  useState(() => {
    form.reset(initialValues);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initialValues ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
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
                    <Input type="number" step="0.01" placeholder="2.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonLabel}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductsPage() {
    const { products, loading, refetch, addProduct, updateProduct, deleteProduct } = useBusinessData();

    const handleAddProduct = async (values: z.infer<typeof productSchema>) => {
        await addProduct(values);
        refetch();
    };

    const handleUpdateProduct = async (productId: string, values: z.infer<typeof productSchema>) => {
        await updateProduct(productId, values);
        refetch();
    };

    const handleDeleteProduct = async (productId: string) => {
        await deleteProduct(productId);
        refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Products</h1>
                <ProductForm 
                    onFormSubmit={handleAddProduct}
                    buttonLabel="Add Product"
                    dialogTitle="Add a new product"
                    dialogDescription="Enter the details of the new product below."
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Product List</CardTitle>
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
                                <TableHead>Product Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>GH₵{product.price.toFixed(2)}</TableCell>
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
                                                    <ProductForm 
                                                        onFormSubmit={(values) => handleUpdateProduct(product.id, values)}
                                                        initialValues={product}
                                                        buttonLabel="Save Changes"
                                                        dialogTitle="Edit Product"
                                                        dialogDescription="Update the details of the product below."
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
                                                    This action cannot be undone. This will permanently delete the product
                                                    and remove it from any existing data.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">
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

    