
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlusCircle, X } from "lucide-react";
import { useBusinessData } from "@/hooks/use-business-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

const ADD_NEW_CUSTOMER_VALUE = 'add_new_customer';

const checkoutSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  newCustomerName: z.string().optional(),
}).refine(data => {
    if (data.customerId === ADD_NEW_CUSTOMER_VALUE) {
        return !!data.newCustomerName && data.newCustomerName.length > 0;
    }
    return true;
}, {
    message: "New customer name is required",
    path: ["newCustomerName"],
});


function CheckoutDialog({ orderItems, total, onCheckout }: { orderItems: OrderItem[], total: number, onCheckout: () => void }) {
    const [open, setOpen] = useState(false);
    const { customers, addCustomer, addOrder } = useBusinessData();
    const form = useForm<z.infer<typeof checkoutSchema>>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { customerId: "", newCustomerName: "" },
    });

    const customerId = form.watch("customerId");

    const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
        let customerName = "";
        if (values.customerId === ADD_NEW_CUSTOMER_VALUE) {
            customerName = values.newCustomerName!;
            addCustomer({ name: customerName, phone: 'N/A (POS)' });
        } else {
            customerName = customers.find(c => c.id === values.customerId)?.name || "Walk-in Customer";
        }

        const productDetails = orderItems.map(p => `${p.name} (x${p.quantity})`).join(', ');

        addOrder({
            customer: customerName,
            product: productDetails,
            total: `GH₵${total.toFixed(2)}`,
            status: 'Completed', // POS orders are completed by default
        });
        
        onCheckout();
        form.reset();
        setOpen(false);
        alert(`Checkout complete! Total: GH₵${total.toFixed(2)}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={orderItems.length === 0}>Checkout</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {orderItems.map(item => (
                         <div key={item.name} className="flex justify-between items-center">
                            <p>{item.name} x {item.quantity}</p>
                            <p>GH₵{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>GH₵{total.toFixed(2)}</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer (Optional)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a customer" />
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
                        <Button type="submit" className="w-full">Confirm & Pay</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}



export default function POSPage() {
    const { products } = useBusinessData();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    
    // Create placeholder images for products that don't have them
    const productsWithImages = products.map((p, i) => ({
        ...p,
        image: `https://picsum.photos/200/20${i % 10}`,
        hint: 'bakery item'
    }))

    const addToOrder = (product: { id: string; name: string; price: number }) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.name === product.name);
            if (existingItem) {
                return prevItems.map(item =>
                    item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromOrder = (productName: string) => {
        setOrderItems(prevItems => prevItems.filter(item => item.name !== productName));
    };
    
    const updateQuantity = (productName: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromOrder(productName);
            return;
        }
        setOrderItems(prevItems => prevItems.map(item => 
            item.name === productName ? { ...item, quantity } : item
        ));
    };

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        setOrderItems([]);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold font-headline mb-6">Point of Sale</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {productsWithImages.map(product => (
                        <Card key={product.name} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addToOrder(product)}>
                            <div className="relative aspect-square w-full">
                               <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint={product.hint} />
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold truncate text-sm">{product.name}</h3>
                                <p className="text-xs text-muted-foreground">GH₵{product.price.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Current Order</CardTitle>
                        <CardDescription>{orderItems.length} item(s)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[50vh] lg:max-h-96 overflow-y-auto">
                        {orderItems.length === 0 ? (
                             <p className="text-muted-foreground text-center py-8">Click on a product to add it to the order.</p>
                        ) : (
                            orderItems.map(item => (
                                <div key={item.name} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</Button>
                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromOrder(item.name)}>
                                            <X className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                         
                    </CardContent>
                    {orderItems.length > 0 && (
                        <>
                            <CardFooter className="flex-col gap-4 !pt-6">
                                <div className="border-t pt-4 w-full flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>GH₵{total.toFixed(2)}</span>
                                </div>
                                <CheckoutDialog orderItems={orderItems} total={total} onCheckout={handleCheckout} />
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
