// Summarize spending habits for the user with insights and saving opportunities.
'use server';

/**
 * @fileOverview AI agent for summarizing spending habits.
 *
 * - summarizeSpending - A function that takes spending data and provides a summary.
 * - SummarizeSpendingInput - The input type for the summarizeSpending function.
 * - SummarizeSpendingOutput - The return type for the summarizeSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingInputSchema = z.object({
  income: z.number().describe('The total income for the month.'),
  expenses: z.record(z.string(), z.number()).describe('A map of expense categories to amounts spent.'),
  budgetGoals: z.record(z.string(), z.number()).describe('A map of budget categories to goals.'),
});
export type SummarizeSpendingInput = z.infer<typeof SummarizeSpendingInputSchema>;

const SummarizeSpendingOutputSchema = z.object({
  summary: z.string().describe('A summary of spending habits, key insights, and areas for potential savings.'),
});
export type SummarizeSpendingOutput = z.infer<typeof SummarizeSpendingOutputSchema>;

export async function summarizeSpending(input: SummarizeSpendingInput): Promise<SummarizeSpendingOutput> {
  return summarizeSpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSpendingPrompt',
  input: {schema: SummarizeSpendingInputSchema},
  output: {schema: SummarizeSpendingOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the following spending data and provide a summary of spending habits, key insights, and areas for potential savings.

Income: {{income}}
Expenses:
{{#each expenses}}
  - {{key}}: {{value}}
{{/each}}
Budget Goals:
{{#each budgetGoals}}
  - {{key}}: {{value}}
{{/each}}

Provide a concise summary with actionable advice.`,
});

const summarizeSpendingFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingFlow',
    inputSchema: SummarizeSpendingInputSchema,
    outputSchema: SummarizeSpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
