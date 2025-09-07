import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { RecentOrdersTable } from "../page";

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Orders</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Order
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <RecentOrdersTable />
                </CardContent>
            </Card>
        </div>
    );
}
