'use server';
/**
 * @fileOverview Generates a custom illustration based on a user prompt.
 *
 * - generateIllustration - A function that handles the illustration generation process.
 * - GenerateIllustrationInput - The input type for the generateIllustration function.
 * - GenerateIllustrationOutput - The return type for the generateIllustration function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getPexelsImages} from '@/services/pexels';
import {getPixabayImages} from '@/services/pixabay';

const GenerateIllustrationInputSchema = z.object({
  prompt: z.string().describe('A prompt for generating a custom illustration.'),
});
export type GenerateIllustrationInput = z.infer<typeof GenerateIllustrationInputSchema>;

const GenerateIllustrationOutputSchema = z.object({
  pexelsImages: z.array(z.object({
    id: z.string(),
    url: z.string(),
    photographer: z.string(),
  })).describe('Images from Pexels.'),
  pixabayImages: z.array(z.object({
    id: z.string(),
    url: z.string(),
    user: z.string(),
  })).describe('Images from Pixabay.'),
});
export type GenerateIllustrationOutput = z.infer<typeof GenerateIllustrationOutputSchema>;

export async function generateIllustration(input: GenerateIllustrationInput): Promise<GenerateIllustrationOutput> {
  return generateIllustrationFlow(input);
}

const illustrationPrompt = ai.definePrompt({
  name: 'illustrationPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('A prompt for generating a custom illustration.'),
    }),
  },
  output: {
    schema: z.object({
      pexelsQuery: z.string().describe('A query to use to search Pexels.'),
      pixabayQuery: z.string().describe('A query to use to search Pixabay.'),
    }),
  },
  prompt: `You are an expert in generating search queries for stock image websites.

  Based on the user's prompt, generate search queries for Pexels and Pixabay that can be used to find relevant images.

  Prompt: {{{prompt}}}`,
});

const generateIllustrationFlow = ai.defineFlow<
  typeof GenerateIllustrationInputSchema,
  typeof GenerateIllustrationOutputSchema
>({
  name: 'generateIllustrationFlow',
  inputSchema: GenerateIllustrationInputSchema,
  outputSchema: GenerateIllustrationOutputSchema,
},
async input => {
  const {output} = await illustrationPrompt(input);

  const pexelsImages = await getPexelsImages(output!.pexelsQuery);
  const pixabayImages = await getPixabayImages(output!.pixabayQuery);

  return {
    pexelsImages,
    pixabayImages,
  };
});
