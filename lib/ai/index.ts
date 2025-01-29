import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import OpenAI from 'openai';
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

import { customMiddleware } from './custom-middleware';

// List of local model IDs
const LOCAL_MODEL_IDS = ['qwen2.5-7b-instruct', 'deepseek-r1-distill-qwen-1.5b'];

// Initialize local model client
const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: 'http://localhost:1234/v1',
});

export const customModel = (apiIdentifier: string) => {
  // Check if the model is a local model
  const isLocalModel = LOCAL_MODEL_IDS.includes(apiIdentifier);

  // For local models, use lmstudio, otherwise use openai
  const model = isLocalModel ? lmstudio(apiIdentifier) : openai(apiIdentifier);

  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};

export const imageGenerationModel = openai.image('dall-e-3');
