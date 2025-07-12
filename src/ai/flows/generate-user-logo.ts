'use server';
/**
 * @fileOverview A flow to generate a unique logo for a user.
 *
 * - generateUserLogo - A function that generates a logo based on user input.
 * - GenerateUserLogoInput - The input type for the generateUserLogo function.
 * - GenerateUserLogoOutput - The return type for the generateUserLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUserLogoInputSchema = z.object({
  email: z.string().describe('The email address of the user.'),
});
export type GenerateUserLogoInput = z.infer<typeof GenerateUserLogoInputSchema>;

const GenerateUserLogoOutputSchema = z.object({
  logoDataUri: z.string().describe('The generated logo as a data URI.'),
});
export type GenerateUserLogoOutput = z.infer<typeof GenerateUserLogoOutputSchema>;

export async function generateUserLogo(
  input: GenerateUserLogoInput
): Promise<GenerateUserLogoOutput> {
  return generateUserLogoFlow(input);
}

const generateUserLogoFlow = ai.defineFlow(
  {
    name: 'generateUserLogoFlow',
    inputSchema: GenerateUserLogoInputSchema,
    outputSchema: GenerateUserLogoOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an abstract, minimalist, and modern logo for a user. The logo should be visually appealing and suitable for a budgeting app named "SpendWise". Use a simple, clean design with a harmonious color palette. The logo should be inspired by the user's email address but should not contain any text. User's email for inspiration: ${input.email}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      logoDataUri: media.url,
    };
  }
);
