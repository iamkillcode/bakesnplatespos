import {createApp} from '@genkit-ai/next';
import '@/ai/flows/generate-sales-report';
import '@/ai/flows/get-analytics-summary';

export const {GET, POST} = createApp();
