
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { getAnalyticsSummary } from '@/ai/flows/get-analytics-summary';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

type ChartData = {
    monthlyRevenue: { month: string; revenue: number }[];
    topProducts: { name: string; revenue: number }[];
    expenseBreakdown: { name: string; cost: number }[];
}

type AnalyticsData = {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    charts: ChartData;
};

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AnalyticsPage() {
    const [summary, setSummary] = useState('');
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user?.role !== 'executive') {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.role === 'executive') {
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
        }
    }, [user]);
    
    if (authLoading || user?.role !== 'executive') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const formatCurrency = (amount: number) => `GH₵${amount.toFixed(2)}`;
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Business Analytics</h1>
            <p className="text-muted-foreground max-w-3xl">
                An AI-powered overview of your business performance, including revenue, expenses, and top products.
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
            
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                        <CardDescription>A look at revenue trends over the last few months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-64 w-full" /> : (
                            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }} className="h-64 w-full">
                                <BarChart data={analytics?.charts.monthlyRevenue}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                                </BarChart>
                             </ChartContainer>
                        )}
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>AI-Powered Insights</CardTitle>
                        <CardDescription>An automated analysis of your business.</CardDescription>
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
            
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>Your most profitable products by revenue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-64 w-full" /> : (
                            <ChartContainer config={{}} className="h-64 w-full">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Legend content={<ChartLegendContent nameKey="name" />} />
                                    <Pie data={analytics?.charts.topProducts} dataKey="revenue" nameKey="name" innerRadius={50}>
                                        {analytics?.charts.topProducts.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>A look at where your money is going.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-64 w-full" /> : (
                            <ChartContainer config={{}} className="h-64 w-full">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Legend content={<ChartLegendContent nameKey="name" />} />
                                    <Pie data={analytics?.charts.expenseBreakdown} dataKey="cost" nameKey="name" innerRadius={50}>
                                        {analytics?.charts.expenseBreakdown.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
