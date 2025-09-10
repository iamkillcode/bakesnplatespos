
'use server';
/**
 * @fileOverview An AI flow that analyzes business data and provides a summary.
 *
 * - getAnalyticsSummary - A function that returns analytics data and an AI-generated summary.
 * - GetAnalyticsSummaryInput - The input type for the getAnalyticsSummary function.
 * - GetAnalyticsSummaryOutput - The return type for the getAnalyticsSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock data as we don't have a database
const mockSalesData = [
  { "date": "2024-05-01", "product": "Croissant", "quantity": 50, "price": 2.50 },
  { "date": "2024-05-01", "product": "Sourdough Loaf", "quantity": 20, "price": 7.00 },
  { "date": "2024-05-02", "product": "Cupcake", "quantity": 100, "price": 3.00 },
  { "date": "2024-05-03", "product": "Croissant", "quantity": 60, "price": 2.50 },
  { "date": "2024-05-04", "product": "Coffee", "quantity": 80, "price": 3.25 },
  { "date": "2024-05-05", "product": "Cheesecake Slice", "quantity": 40, "price": 5.00 },
];
const mockExpensesData = [
  { "date": "2024-05-01", "item": "Flour", "cost": 50.00 },
  { "date": "2024-05-01", "item": "Sugar", "cost": 30.00 },
  { "date": "2024-05-02", "item": "Packaging", "cost": 75.00 },
  { "date": "2024-05-03", "item": "Butter", "cost": 120.00 },
  { "date": "2024-05-04", "item": "Coffee Beans", "cost": 90.00 },
  { "date": "2024-05-05", "item": "Cream Cheese", "cost": 60.00 },
];

const AnalyticsSchema = z.object({
    totalRevenue: z.number().describe('The total revenue from sales.'),
    totalExpenses: z.number().describe('The total cost of expenses.'),
    netProfit: z.number().describe('The net profit (revenue - expenses).'),
});

const GetAnalyticsSummaryInputSchema = z.object({});
export type GetAnalyticsSummaryInput = z.infer<typeof GetAnalyticsSummaryInputSchema>;

const GetAnalyticsSummaryOutputSchema = z.object({
  summary: z.string().describe('A friendly, insightful summary of the business analytics.'),
  analytics: AnalyticsSchema,
});
export type GetAnalyticsSummaryOutput = z.infer<typeof GetAnalyticsSummaryOutputSchema>;


const getAnalyticsData = ai.defineTool(
    {
        name: 'getAnalyticsData',
        description: 'Returns key business analytics data like revenue, expenses, and profit.',
        inputSchema: z.object({}),
        outputSchema: AnalyticsSchema,
    },
    async () => {
        const totalRevenue = mockSalesData.reduce((acc, sale) => acc + (sale.quantity * sale.price), 0);
        const totalExpenses = mockExpensesData.reduce((acc, expense) => acc + expense.cost, 0);
        const netProfit = totalRevenue - totalExpenses;
        
        return {
            totalRevenue,
            totalExpenses,
            netProfit,
        };
    }
);


const analyticsPrompt = ai.definePrompt({
  name: 'analyticsSummaryPrompt',
  input: { schema: z.object({}) },
  output: { schema: z.object({ summary: z.string() }) },
  tools: [getAnalyticsData],
  prompt: `You are a helpful business analyst AI. Your goal is to provide a clear and insightful summary of the business's performance based on the provided data.
  
  Use the getAnalyticsData tool to fetch the required metrics.
  
  In your summary, explain the Total Revenue, Total Expenses, and Net Profit. Provide context and identify any key takeaways. Keep the tone professional but encouraging.`,
});


const getAnalyticsSummaryFlow = ai.defineFlow(
    {
        name: 'getAnalyticsSummaryFlow',
        inputSchema: GetAnalyticsSummaryInputSchema,
        outputSchema: GetAnalyticsSummaryOutputSchema,
    },
    async () => {
        const analyticsResponse = await analyticsPrompt();
        
        // We also need the raw data, so we call the tool directly.
        // In a real scenario, you might only call the prompt and have it return all the data.
        const analyticsData = await getAnalyticsData({});
        
        return {
            summary: analyticsResponse.output!.summary,
            analytics: analyticsData,
        };
    }
);

export async function getAnalyticsSummary(input: GetAnalyticsSummaryInput): Promise<GetAnalyticsSummaryOutput> {
  return getAnalyticsSummaryFlow(input);
}
