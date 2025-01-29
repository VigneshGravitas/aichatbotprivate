// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'qwen2.5-7b-instruct',
    label: 'Qwen 2.5 7B Instruct',
    apiIdentifier: 'qwen2.5-7b-instruct',
    description: 'Local Qwen 2.5 7B model running on LM Studio',
  },
  {
    id: 'deepseek-r1-distill-qwen-1.5b',
    label: 'Deepseek R1 Distill Qwen 1.5B',
    apiIdentifier: 'deepseek-r1-distill-qwen-1.5b',
    description: 'Local Deepseek R1 model running on LM Studio',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'For complex, multi-step tasks',
  },
];

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
