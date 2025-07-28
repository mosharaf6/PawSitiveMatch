'use server';

/**
 * @fileOverview Generates a unique image for a pet using AI.
 *
 * - generatePetImage - A function that takes pet details and generates an image.
 * - GeneratePetImageInput - The input type for the generatePetImage function.
 * - GeneratePetImageOutput - The return type for the generatePetImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePetImageInputSchema = z.object({
  species: z.string().describe('The species of the pet (e.g., Dog, Cat).'),
  breed: z.string().describe('The breed of the pet.'),
  prompt: z.string().optional().describe('An optional creative prompt for the image.'),
});
export type GeneratePetImageInput = z.infer<typeof GeneratePetImageInputSchema>;

const GeneratePetImageOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GeneratePetImageOutput = z.infer<typeof GeneratePetImageOutputSchema>;

export async function generatePetImage(input: GeneratePetImageInput): Promise<GeneratePetImageOutput> {
  return generatePetImageFlow(input);
}

const generatePetImageFlow = ai.defineFlow(
  {
    name: 'generatePetImageFlow',
    inputSchema: GeneratePetImageInputSchema,
    outputSchema: GeneratePetImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A high-quality, photo-realistic image of a ${input.breed} ${input.species}. ${input.prompt || 'The pet should be in a happy, friendly pose, suitable for an adoption website.'}`,
        config: {
        responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media) {
        throw new Error('Image generation failed to produce media.');
    }
    
    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Image generation failed to produce an image.');
    }

    return { imageUrl };
  }
);
