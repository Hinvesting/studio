'use server';

import configureGenkit from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
// Import other potential AI providers
// import { anthropic } from '@genkit-ai/anthropic';
// import { huggingFace } from '@genkit-ai/huggingface';
// import { openAI } from '@genkit-ai/openai';
// import { perplexity } from '@genkit-ai/perplexity';

// Initialize the Genkit instance
export const ai = configureGenkit({
  plugins: [
    googleAI({
      // Add your Google AI API key here
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
    // Add other plugins here with their configurations
    // anthropic({
    //   apiKey: process.env.ANTHROPIC_API_KEY,
    // }),
    // huggingFace({
    //   apiKey: process.env.HF_API_KEY,
    // }),
    // openAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // }),
    // perplexity({
    //   apiKey: process.env.PERPLEXITY_API_KEY,
    // }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
