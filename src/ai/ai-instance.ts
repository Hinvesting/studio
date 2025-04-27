'use server';

import { configureGenkit } from 'genkit'; // Reverted import to match package.json
import { googleAI } from '@genkit-ai/googleai'; // Using Google AI as a placeholder

export const ai = configureGenkit({
  plugins: [
    googleAI({ // Placeholder - replace/add Anthropic, HuggingFace, OpenAI, Perplexity configs as needed
      // Add API keys and configurations here if required by the specific plugin
      // apiKey: process.env.GOOGLE_GENAI_API_KEY, // Example for Google AI
    }),
    // Add other plugins here, e.g., Anthropic, Hugging Face, OpenAI
  ],
  logLevel: 'debug', // Set log level (optional)
  enableTracingAndMetrics: true, // Enable telemetry (optional)
});
