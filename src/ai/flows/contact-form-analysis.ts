'use server';

/**
 * @fileOverview Analyzes the content of contact form submissions to determine if it is appropriate and relevant.
 *
 * - analyzeContent - A function that analyzes the content of a contact form submission.
 * - ContactFormContentInput - The input type for the analyzeContent function.
 * - ContactFormContentOutput - The return type for the analyzeContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ContactFormContentInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z
    .string()
    .email()
    .describe('The email address of the person submitting the form.'),
  message: z.string().describe('The message content from the contact form.'),
});
export type ContactFormContentInput = z.infer<
  typeof ContactFormContentInputSchema
>;

const ContactFormContentOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe('Whether the content is appropriate for a business inquiry.'),
  isRelevant: z
    .boolean()
    .describe('Whether the content is relevant to the website or business.'),
  reason: z
    .string()
    .optional()
    .describe('The reason why the content might be inappropriate or irrelevant.'),
});
export type ContactFormContentOutput = z.infer<
  typeof ContactFormContentOutputSchema
>;

export async function analyzeContent(
  input: ContactFormContentInput
): Promise<ContactFormContentOutput> {
  return analyzeContentFlow(input);
}

const analyzeContentPrompt = ai.definePrompt({
  name: 'analyzeContentPrompt',
  input: { schema: ContactFormContentInputSchema },
  output: { schema: ContactFormContentOutputSchema },
  prompt: `You are an AI assistant specializing in analyzing contact form submissions to ensure they are appropriate and relevant for a business inquiry.

  Analyze the following contact form submission and determine if its content is appropriate and relevant.

  Name: {{{name}}}
  Email: {{{email}}}
  Message: {{{message}}}

  Consider the following when determining if the message is appropriate:
  - The message does not contain offensive, discriminatory, or harmful language.
  - The message does not violate ethical or legal standards.

  Consider the following when determining if the message is relevant:
  - The message pertains to the website's purpose, products, or services.
  - The message is a genuine inquiry or request for information.
  - The message is not spam or promotional content.
`,
});

const analyzeContentFlow = ai.defineFlow(
  {
    name: 'analyzeContentFlow',
    inputSchema: ContactFormContentInputSchema,
    outputSchema: ContactFormContentOutputSchema,
  },
  async (input) => {
    const response = await analyzeContentPrompt(input);
    return response.output!;
  }
);
