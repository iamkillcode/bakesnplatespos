'use server';

/**
 * @fileOverview AI-powered sales report generator.
 *
 * - generateSalesReport - A function that generates sales reports using AI.
 * - GenerateSalesReportInput - The input type for the generateSalesReport function.
 * - GenerateSalesReportOutput - The return type for the generateSalesReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
  expensesData: z.string().describe('Expense data in JSON format.'),
  startDate: z.string().describe('The start date for the report.'),
  endDate: z.string().describe('The end date for the report.'),
});
export type GenerateSalesReportInput = z.infer<typeof GenerateSalesReportInputSchema>;

const GenerateSalesReportOutputSchema = z.object({
  report: z.string().describe('The generated sales report.'),
});
export type GenerateSalesReportOutput = z.infer<typeof GenerateSalesReportOutputSchema>;

export async function generateSalesReport(input: GenerateSalesReportInput): Promise<GenerateSalesReportOutput> {
  return generateSalesReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesReportPrompt',
  input: {schema: GenerateSalesReportInputSchema},
  output: {schema: GenerateSalesReportOutputSchema},
  prompt: `You are an AI assistant that analyzes sales and expense data to generate insightful sales reports.

  Analyze the provided sales data and expense data between the start and end dates to generate a comprehensive sales report that includes:

  - Sales trends (daily, weekly, monthly)
  - Top-selling products
  - Profit vs expenses

  Sales Data: {{{salesData}}}
  Expense Data: {{{expensesData}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Report:`,
});

const generateSalesReportFlow = ai.defineFlow(
  {
    name: 'generateSalesReportFlow',
    inputSchema: GenerateSalesReportInputSchema,
    outputSchema: GenerateSalesReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
