'use server';
/**
 * @fileOverview An AI-powered tool that provides optimized savings strategies and financial forecasts.
 *
 * - smartBudgetingTool - A function that handles the budget optimization and forecasting process.
 * - SmartBudgetingToolInput - The input type for the smartBudgetingTool function.
 * - SmartBudgetingToolOutput - The return type for the smartBudgetingTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartBudgetingToolInputSchema = z.object({
  income: z.number().describe('Total monthly income.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('The expense category.'),
      amount: z.number().describe('The amount spent in that category.'),
    })
  ).describe('A list of expenses with their categories and amounts.'),
  budgetGoals: z.array(
    z.object({
      category: z.string().describe('The budget category.'),
      goal: z.number().describe('The budget goal for that category.'),
    })
  ).describe('A list of budget goals for each category.'),
  riskTolerance: z.enum(['low', 'medium', 'high']).describe('The user\'s risk tolerance level.'),
});
export type SmartBudgetingToolInput = z.infer<typeof SmartBudgetingToolInputSchema>;

const SmartBudgetingToolOutputSchema = z.object({
  savingsSuggestions: z.string().describe('Suggestions for optimizing savings strategies.'),
  financialForecast: z.string().describe('A financial forecast based on the provided data.'),
});
export type SmartBudgetingToolOutput = z.infer<typeof SmartBudgetingToolOutputSchema>;

export async function smartBudgetingTool(input: SmartBudgetingToolInput): Promise<SmartBudgetingToolOutput> {
  return smartBudgetingToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartBudgetingToolPrompt',
  input: {schema: SmartBudgetingToolInputSchema},
  output: {schema: SmartBudgetingToolOutputSchema},
  prompt: `You are a financial advisor providing personalized savings suggestions and financial forecasts.

  Based on the user's income, expenses, budget goals, and risk tolerance, provide tailored advice.

  Income: {{{income}}}
  Expenses:
  {{#each expenses}}
  - Category: {{{category}}}, Amount: {{{amount}}}
  {{/each}}
  Budget Goals:
  {{#each budgetGoals}}
  - Category: {{{category}}}, Goal: {{{goal}}}
  {{/each}}
  Risk Tolerance: {{{riskTolerance}}}

  Provide savings suggestions and a financial forecast. Be concise and actionable.
  `,
});

const smartBudgetingToolFlow = ai.defineFlow(
  {
    name: 'smartBudgetingToolFlow',
    inputSchema: SmartBudgetingToolInputSchema,
    outputSchema: SmartBudgetingToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
