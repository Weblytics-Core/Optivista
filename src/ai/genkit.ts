import {genkit} from 'genkit/ai';
import {googleAI} from '@genkit-ai/google-genai';
import {configureGenkit} from 'genkit';

configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const model = googleAI.model('gemini-2.5-flash');
