import ReportGenerator from './ReportGenerator';

export default function ReportsPage() {
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
