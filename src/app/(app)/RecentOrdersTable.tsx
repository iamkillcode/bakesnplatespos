
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Order } from '@/hooks/use-business-data';
import { format } from 'date-fns';

function getStatusVariant(status: string) {
  switch (status) {
    case 'Completed':
      return 'secondary';
    case 'Pending':
      return 'default';
    case 'In Progress':
      return 'outline';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function RecentOrdersTable({
  orders,
  onUpdateOrder,
}: {
  orders: Order[];
  onUpdateOrder: (orderId: string, newStatus: string) => void;
}) {
  const handleStatusChange = (orderId: string, newStatus: string) => {
    onUpdateOrder(orderId, newStatus);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
            <TableCell className="font-medium">{order.customer}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell>
              {format(new Date(order.date), 'dd MMM yyyy, hh:mm a')}
            </TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>
              <Select
                value={order.status}
                onValueChange={(newStatus) =>
                  handleStatusChange(order.id, newStatus)
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue>
                    <Badge
                      variant={getStatusVariant(order.status)}
                      className="capitalize"
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
