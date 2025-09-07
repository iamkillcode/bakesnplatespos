import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const customers = [
    { id: 'CUS001', name: 'John Doe', phone: '555-0101', totalOrders: 5, totalSpent: '$450.20' },
    { id: 'CUS002', name: 'Jane Smith', phone: '555-0102', totalOrders: 2, totalSpent: '$95.50' },
    { id: 'CUS003', name: 'Bob Johnson', phone: '555-0103', totalOrders: 8, totalSpent: '$1205.00' },
    { id: 'CUS004', name: 'Alice Williams', phone: '555-0104', totalOrders: 12, totalSpent: '$780.25' },
    { id: 'CUS005', name: 'Charlie Brown', phone: '555-0105', totalOrders: 1, totalSpent: '$99.99' },
];

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Customers</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
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
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.totalOrders}</TableCell>
                                    <TableCell>{customer.totalSpent}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
