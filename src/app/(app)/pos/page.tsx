
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { X } from "lucide-react";

const products = [
    { name: "Croissant", price: 2.50, image: "https://picsum.photos/200/200", hint: "pastry" },
    { name: "Sourdough", price: 7.00, image: "https://picsum.photos/200/201", hint: "bread" },
    { name: "Cupcake", price: 3.00, image: "https://picsum.photos/201/200", hint: "cake" },
    { name: "Baguette", price: 4.50, image: "https://picsum.photos/201/201", hint: "bread" },
    { name: "Macaron", price: 1.75, image: "https://picsum.photos/202/200", hint: "cookie" },
    { name: "Cinnamon Roll", price: 3.50, image: "https://picsum.photos/200/202", hint: "pastry" },
    { name: "Cheesecake Slice", price: 5.00, image: "https://picsum.photos/202/202", hint: "cake" },
    { name: "Coffee", price: 3.25, image: "https://picsum.photos/202/201", hint: "drink" },
];

type OrderItem = {
    name: string;
    price: number;
    quantity: number;
};

export default function POSPage() {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const addToOrder = (product: { name: string; price: number }) => {
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

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        // In a real app, this would process the payment and create an order record.
        alert(`Checkout complete! Total: GH₵${total.toFixed(2)}`);
        setOrderItems([]);
    };

    return (
        <div className="grid md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold font-headline mb-6">Point of Sale</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
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
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Current Order</CardTitle>
                        <CardDescription>{orderItems.length} item(s)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                        {orderItems.length === 0 ? (
                             <p className="text-muted-foreground text-center py-8">Click on a product to add it to the order.</p>
                        ) : (
                            orderItems.map(item => (
                                <div key={item.name} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>GH₵{(item.price * item.quantity).toFixed(2)}</span>
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
                                <Button className="w-full" onClick={handleCheckout}>Checkout</Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
