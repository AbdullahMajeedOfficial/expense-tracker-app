'use server';

/**
 * @fileOverview A flow to suggest relevant budget categories based on user income and lifestyle.
 *
 * - suggestBudgetCategories - A function that suggests budget categories.
 * - SuggestBudgetCategoriesInput - The input type for the suggestBudgetCategories function.
 * - SuggestBudgetCategoriesOutput - The return type for the suggestBudgetCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBudgetCategoriesInputSchema = z.object({
  income: z.number().describe('The user\u2019s monthly income.'),
  lifestyle: z
    .string()
    .describe(
      'A brief description of the user\u2019s lifestyle, including living situation, transportation, and hobbies.'
    ),
});
export type SuggestBudgetCategoriesInput = z.infer<typeof SuggestBudgetCategoriesInputSchema>;

const SuggestBudgetCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested budget categories relevant to the user.'),
});
export type SuggestBudgetCategoriesOutput = z.infer<typeof SuggestBudgetCategoriesOutputSchema>;

export async function suggestBudgetCategories(
  input: SuggestBudgetCategoriesInput
): Promise<SuggestBudgetCategoriesOutput> {
  return suggestBudgetCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBudgetCategoriesPrompt',
  input: {schema: SuggestBudgetCategoriesInputSchema},
  output: {schema: SuggestBudgetCategoriesOutputSchema},
  prompt: `You are a personal finance expert. Based on the user's income and lifestyle, suggest a list of relevant budget categories.

Income: {{{income}}}
Lifestyle: {{{lifestyle}}}

Categories:`,
});

const suggestBudgetCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestBudgetCategoriesFlow',
    inputSchema: SuggestBudgetCategoriesInputSchema,
    outputSchema: SuggestBudgetCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
