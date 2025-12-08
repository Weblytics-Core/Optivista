'use server';

/**
 * @fileOverview Analyzes the sentiment of contact form submissions using GenAI.
 *
 * - analyzeContactFormSubmission - A function that analyzes the sentiment of a contact form submission.
 * - ContactFormInput - The input type for the analyzeContactFormSubmission function.
 * - ContactFormOutput - The return type for the analyzeContactFormSubmission function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z
    .string()
    .email()
    .describe('The email address of the person submitting the form.'),
  message: z.string().describe('The message content from the contact form.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

const ContactFormOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The overall sentiment of the message (positive, negative, or neutral).'
    ),
  isSpam: z.boolean().describe('Whether the message is likely to be spam.'),
  urgency: z
    .string()
    .describe(
      'The urgency of the message (high, medium, or low) based on the content.'
    ),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;

export async function analyzeContactFormSubmission(
  input: ContactFormInput
): Promise<ContactFormOutput> {
  return analyzeContactFormSubmissionFlow(input);
}

const analyzeSentimentPrompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: { schema: ContactFormInputSchema },
  output: { schema: ContactFormOutputSchema },
  prompt: `You are an AI assistant specializing in analyzing contact form submissions.

  Analyze the following contact form submission and determine its sentiment, whether it is spam, and its urgency.

  Name: {{{name}}}
  Email: {{{email}}}
  Message: {{{message}}}

  Consider the following when determining sentiment:
  - Positive: The message expresses satisfaction, gratitude, or compliments.
  - Negative: The message expresses dissatisfaction, complaints, or criticism.
  - Neutral: The message is informational or requires a response without expressing strong emotion.

  Consider the following when determining if the message is spam:
  - The message contains promotional content or unsolicited offers.
  - The message contains irrelevant links or suspicious URLs.
  - The message uses generic greetings or lacks personalization.

  Consider the following when determining urgency:
  - High: The message reports a critical issue, security vulnerability, or requires immediate attention.
  - Medium: The message requires a response within 24-48 hours or addresses a non-critical issue.
  - Low: The message is informational, a general inquiry, or can be addressed at your convenience.
`,
});

const analyzeContactFormSubmissionFlow = ai.defineFlow(
  {
    name: 'analyzeContactFormSubmissionFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormOutputSchema,
  },
  async (input) => {
    const response = await analyzeSentimentPrompt(input);
    return response.output!;
  }
);
