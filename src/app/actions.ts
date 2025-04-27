'use server';

import { generateArticle, GenerateArticleInput, GenerateArticleOutput } from '@/ai/flows/generate-article';
import { generateIllustration, GenerateIllustrationInput, GenerateIllustrationOutput } from '@/ai/flows/generate-illustration';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Zod schemas for input validation
const ArticleInputSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
});

const IllustrationInputSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters long."),
});


export async function handleGenerateArticle(
  prevState: any,
  formData: FormData
): Promise<{ message: string | null; data: GenerateArticleOutput | null; error: string | null }> {
  const rawFormData = {
    topic: formData.get('topic'),
  };

  const validatedFields = ArticleInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
     const validationError = fromZodError(validatedFields.error);
     console.error('Validation Error:', validationError.toString());
    return { message: null, data: null, error: validationError.toString() };
  }

  try {
    const result = await generateArticle(validatedFields.data as GenerateArticleInput);
    return { message: 'Article generated successfully.', data: result, error: null };
  } catch (error) {
    console.error('Error generating article:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: null, data: null, error: `Failed to generate article: ${errorMessage}` };
  }
}

export async function handleGenerateIllustration(
  prevState: any,
  formData: FormData
): Promise<{ message: string | null; data: GenerateIllustrationOutput | null; error: string | null }> {
 const rawFormData = {
    prompt: formData.get('prompt'),
  };

  const validatedFields = IllustrationInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const validationError = fromZodError(validatedFields.error);
    console.error('Validation Error:', validationError.toString());
    return { message: null, data: null, error: validationError.toString() };
  }

  try {
    // Note: getPexelsImages and getPixabayImages currently return mock data.
    // TODO: Replace with actual API calls if implementing those.
    const result = await generateIllustration(validatedFields.data as GenerateIllustrationInput);
    return { message: 'Illustrations generated successfully.', data: result, error: null };
  } catch (error) {
    console.error('Error generating illustration:', error);
     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: null, data: null, error: `Failed to generate illustration: ${errorMessage}` };
  }
}
