'use client';

import React, { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { generateSalesReport } from '@/ai/flows/generate-sales-report';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
});

// Mock data as we don't have a database
const mockSalesData = [
  { "date": "2024-05-01", "product": "Croissant", "quantity": 50, "price": 2.50 },
  { "date": "2024-05-01", "product": "Sourdough Loaf", "quantity": 20, "price": 7.00 },
  { "date": "2024-05-02", "product": "Cupcake", "quantity": 100, "price": 3.00 },
  { "date": "2024-05-03", "product": "Croissant", "quantity": 60, "price": 2.50 },
];
const mockExpensesData = [
  { "date": "2024-05-01", "item": "Flour", "cost": 50.00 },
  { "date": "2024-05-01", "item": "Sugar", "cost": 30.00 },
  { "date": "2024-05-02", "item": "Packaging", "cost": 75.00 },
];

export default function ReportGenerator() {
  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setReport(null);
    startTransition(async () => {
      try {
        const result = await generateSalesReport({
          startDate: format(values.dateRange.from, 'yyyy-MM-dd'),
          endDate: format(values.dateRange.to, 'yyyy-MM-dd'),
          salesData: JSON.stringify(mockSalesData),
          expensesData: JSON.stringify(mockExpensesData),
        });
        setReport(result.report);
      } catch (e) {
        setError('Failed to generate report. Please try again.');
        console.error(e);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-end gap-4">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={{ from: field.value?.from, to: field.value?.to }}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Report
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isPending && (
         <Card>
            <CardHeader>
                <CardTitle>Generating Report...</CardTitle>
                <CardDescription>AI is analyzing the data. Please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Generated on {format(new Date(), "LLL dd, y")}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-body text-sm bg-muted/50 p-4 rounded-lg">
                {report}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
