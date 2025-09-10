
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportGenerator from './ReportGenerator';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';


export default function ReportsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user?.role !== 'executive') {
            router.push('/');
        }
    }, [user, authLoading, router]);

    if (authLoading || user?.role !== 'executive') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">AI-Powered Trend Analysis</h1>
      <p className="text-muted-foreground max-w-2xl">
        Select a date range to generate an insightful report on sales trends, top-selling products, and profit vs. expenses using generative AI. The AI will analyze mock sales and expense data to create a comprehensive summary.
      </p>
      <ReportGenerator />
    </div>
  );
}
