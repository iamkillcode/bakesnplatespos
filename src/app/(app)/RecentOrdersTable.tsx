
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statuses = ['Completed', 'Pending', 'In Progress', 'Cancelled'];

function getStatusVariant(status: string) {
    switch (status) {
        case 'Completed': return 'secondary';
        case 'Pending': return 'default';
        case 'In Progress': return 'outline';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
}

export type Order = {
    id: string;
    customer: string;
    product: string;
    date: string;
    total: string;
    status: string;
}

export function RecentOrdersTable({ orders, onUpdateOrder }: { orders: Order[], onUpdateOrder: (orderId: string, newStatus: string) => void }) {
    
    const handleStatusChange = (orderId: string, newStatus: string) => {
        onUpdateOrder(orderId, newStatus);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product(s)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.product}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>
                           <Select value={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                               <SelectTrigger className="w-36">
                                   <Badge variant={getStatusVariant(order.status)} className="capitalize w-full justify-center">
                                     <SelectValue>{order.status.toLowerCase()}</SelectValue>
                                   </Badge>
                               </SelectTrigger>
                               <SelectContent>
                                   {statuses.map(status => (
                                       <SelectItem key={status} value={status}>
                                            <Badge variant={getStatusVariant(status)} className="capitalize w-full justify-center">
                                                {status.toLowerCase()}
                                            </Badge>
                                       </SelectItem>
                                   ))}
                               </SelectContent>
                           </Select>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
