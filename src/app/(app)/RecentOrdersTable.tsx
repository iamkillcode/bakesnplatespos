
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
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type SortDescriptor = {
  column: keyof Order | null;
  direction: 'ascending' | 'descending';
};

export function RecentOrdersTable({
  orders,
  onUpdateOrder,
  sortDescriptor,
  onSortChange,
  className,
}: {
  orders: Order[];
  onUpdateOrder: (orderId: string, newStatus: string) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  className?: string;
}) {
  const handleStatusChange = (orderId: string, newStatus: string) => {
    onUpdateOrder(orderId, newStatus);
  };

  const createSortHandler = (column: keyof Order) => () => {
    if (!onSortChange || !sortDescriptor) return;
    const isAsc = sortDescriptor.column === column && sortDescriptor.direction === 'ascending';
    onSortChange({
      column,
      direction: isAsc ? 'descending' : 'ascending',
    });
  };

  const renderSortIcon = (column: keyof Order) => {
    if (!sortDescriptor || sortDescriptor.column !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortDescriptor.direction === 'ascending') {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const SortableHeader = ({ column, children }: { column: keyof Order, children: React.ReactNode }) => {
    if (!onSortChange) {
      return <TableHead>{children}</TableHead>;
    }
    return (
       <TableHead>
          <Button variant="ghost" onClick={createSortHandler(column)} className="px-0 py-0 h-auto font-bold">
            {children}
            {renderSortIcon(column)}
          </Button>
       </TableHead>
    )
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <SortableHeader column="customer">Customer</SortableHeader>
          <TableHead>Product(s)</TableHead>
          <SortableHeader column="date">Date</SortableHeader>
          <SortableHeader column="total">Total</SortableHeader>
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
