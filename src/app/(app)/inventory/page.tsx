import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";

const inventoryItems = [
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

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Inventory</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
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
