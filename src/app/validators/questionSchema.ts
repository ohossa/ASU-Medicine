import { z } from 'zod';

const MediaSchema = z.object({
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
}).optional();

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(5),
  type: z.enum(['mcq', 'truefalse', 'essay', 'fillblank', 'matching', 'case_study']),
  explanation: z.string().min(30).refine(
    s => !s.toLowerCase().includes('review the related lecture material'),
    { message: 'Placeholder explanation rejected' }
  ),
  correctAnswer: z.union([z.string(), z.number(), z.array(z.any()), z.record(z.any())]).optional(),
  options: z.array(z.string()).optional(),
  difficulty: z.number().min(1).max(5).optional(),
  bloomLevel: z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']).optional(),
  tags: z.array(z.string().min(1)).optional(),
  estimatedTimeSeconds: z.number().positive().optional(),
  media: MediaSchema,
  avgCorrectRate: z.number().min(0).max(1).optional(),
  totalAttempts: z.number().int().nonnegative().optional(),
  discriminationIndex: z.number().optional(),
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;