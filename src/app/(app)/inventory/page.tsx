
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialInventoryItems = [
    { id: 'INV001', name: 'All-Purpose Flour', stock: '50 kg', reorder: '20 kg', status: 'In Stock' },
    { id: 'INV002', name: 'Granulated Sugar', stock: '15 kg', reorder: '10 kg', status: 'Low Stock' },
    { id: 'INV003', name: 'Unsalted Butter', stock: '25 kg', reorder: '5 kg', status: 'In Stock' },
    { id: 'INV004', name: 'Large Eggs', stock: '10 dozen', reorder: '12 dozen', status: 'Low Stock' },
    { id: 'INV005', name: 'Cake Boxes (10")', stock: '8 units', reorder: '50 units', status: 'Out of Stock' },
];

function getStatusVariant(status: string) {
    switch (status) {
        case 'In Stock': return 'secondary';
        case 'Low Stock': return 'default';
        case 'Out of Stock': return 'destructive';
        default: return 'outline';
    }
}

const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  stock: z.string().min(1, "Current stock is required"),
  reorder: z.string().min(1, "Reorder point is required"),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']),
});

function AddInventoryItemForm({ onIteAdded }: { onItemAdded: (item: any) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: { name: "", stock: "", reorder: "", status: "In Stock" },
  });

  const onSubmit = (values: z.infer<typeof inventorySchema>) => {
    const newItem = {
      id: `INV${String(initialInventoryItems.length + 1).padStart(3, '0')}`,
      ...values,
    };
    onItemAdded(newItem);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the new inventory item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chocolate Chips" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10 kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="reorder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Point</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5 kg" {...field} />
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
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Item</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function InventoryPage() {
    const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

    const handleAddItem = (item: any) => {
        setInventoryItems(prev => [...prev, item]);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Inventory</h1>
                <AddInventoryItemForm onItemAdded={handleAddItem} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Stock Levels</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Reorder Point</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>{item.reorder}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(item.status)} className="capitalize">
                                            {item.status.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
