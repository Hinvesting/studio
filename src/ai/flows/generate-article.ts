'use server';
/**
 * @fileOverview A content generation AI agent that produces articles based on a topic.
 *
 * - generateArticle - A function that handles the article generation process.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Perplexity} from "@anthropic-ai/sdk/lib/ Bedrock";

const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The topic of the article to be generated.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  article: z.string().describe('The generated article.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}

const generateArticlePrompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the article to be generated.'),
    }),
  },
  output: {
    schema: z.object({
      article: z.string().describe('The generated article.'),
    }),
  },
  prompt: `You are a content creator. Generate an article about the following topic:\n\n{{topic}}`,
});

const generateArticleFlow = ai.defineFlow<
  typeof GenerateArticleInputSchema,
  typeof GenerateArticleOutputSchema
>({
  name: 'generateArticleFlow',
  inputSchema: GenerateArticleInputSchema,
  outputSchema: GenerateArticleOutputSchema,
}, async input => {
  const {output} = await generateArticlePrompt(input);
  return output!;
});
