

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { getAnalyticsSummary } from '@/ai/flows/get-analytics-summary';
import { Skeleton } from '@/components/ui/skeleton';

type AnalyticsData = {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
};

export default function AnalyticsPage() {
    const [summary, setSummary] = useState('');
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            setLoading(true);
            try {
                const result = await getAnalyticsSummary({});
                setSummary(result.summary);
                setAnalytics(result.analytics);
            } catch (error) {
                console.error('Failed to fetch analytics summary:', error);
                setSummary('Could not load AI-powered summary. Please try again later.');
            }
            setLoading(false);
        }
        fetchAnalytics();
    }, []);

    const formatCurrency = (amount: number) => `GH₵${amount.toFixed(2)}`;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Business Analytics</h1>
            <p className="text-muted-foreground max-w-3xl">
                An AI-powered overview of your business performance. These metrics are calculated from your orders and expenses data to provide a clear picture of your financial health.
            </p>

            <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue ?? 0)}</div>}
                        <p className="text-xs text-muted-foreground">From all completed orders</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{formatCurrency(analytics?.totalExpenses ?? 0)}</div>}
                        <p className="text-xs text-muted-foreground">From all recorded expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{formatCurrency(analytics?.netProfit ?? 0)}</div>}
                        <p className="text-xs text-muted-foreground">Revenue minus expenses</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>An automated analysis of your business performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
