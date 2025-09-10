
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialOrders = [
    { id: 'ORD001', customer: 'John Doe', date: '2023-11-20', total: 'GH₵150.00', status: 'Completed' },
    { id: 'ORD002', customer: 'Jane Smith', date: '2023-11-21', total: 'GH₵45.50', status: 'Pending' },
    { id: 'ORD003', customer: 'Bob Johnson', date: '2023-11-21', total: 'GH₵205.00', status: 'In Progress' },
    { id: 'ORD004', customer: 'Alice Williams', date: '2023-11-22', total: 'GH₵78.25', status: 'Completed' },
    { id: 'ORD005', customer: 'Charlie Brown', date: '2023-11-23', total: 'GH₵99.99', status: 'Cancelled' },
];

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


export function RecentOrdersTable({ orders: ordersProp, onUpdateOrder }: { orders?: any[], onUpdateOrder?: (orderId: string, newStatus: string) => void }) {
    const [orders, setOrders] = useState(ordersProp || initialOrders);

    useEffect(() => {
        if (ordersProp) {
            setOrders(ordersProp);
        }
    }, [ordersProp]);

    const handleStatusChange = (orderId: string, newStatus: string) => {
        if (onUpdateOrder) {
            onUpdateOrder(orderId, newStatus);
        } else {
            // Fallback to internal state update if no handler is provided
            setOrders(currentOrders =>
                currentOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
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
