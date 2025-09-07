import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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

export default function POSPage() {
    return (
        <div className="grid md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold font-headline mb-6">Point of Sale</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <Card key={product.name} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                            <div className="relative aspect-square w-full">
                               <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint={product.hint} />
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold truncate text-sm">{product.name}</h3>
                                <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Current Order</CardTitle>
                        <CardDescription>2 items</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Croissant</p>
                                <p className="text-sm text-muted-foreground">x 1</p>
                            </div>
                            <span>$2.50</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <div>
                                <p className="font-medium">Cupcake</p>
                                <p className="text-sm text-muted-foreground">x 1</p>
                            </div>
                            <span>$3.00</span>
                         </div>
                         <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>$5.50</span>
                         </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full">Checkout</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
