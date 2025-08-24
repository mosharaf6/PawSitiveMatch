
'use server';

import {
  getPetRecommendations,
  type PetPreferencesInput,
  type PetRecommendationsOutput,
} from '@/ai/flows/personalized-pet-recommendations';
import {
  generatePetBio,
  type GeneratePetBioInput,
} from '@/ai/flows/generate-pet-bio';
import {
  askVetAssistant,
  type AskVetAssistantInput,
} from '@/ai/flows/ask-vet-assistant';
import {
    generatePetImage,
    type GeneratePetImageInput,
    type GeneratePetImageOutput,
} from '@/ai/flows/generate-pet-image';
import { createStreamableValue } from 'ai/rsc';
import { ai } from '@/ai/genkit';

export async function getPetRecommendationsAction(
  input: PetPreferencesInput
): Promise<{ recommendations: PetRecommendationsOutput | null; error: string | null }> {
  try {
    // Adding a placeholder location if not provided, as it's required by the AI model.
    const finalInput = {
        ...input,
        location: input.location || 'Any',
    };

    const recommendations = await getPetRecommendations(finalInput);
    if (!recommendations || recommendations.length === 0) {
        return { recommendations: null, error: 'No matching pets found. Try adjusting your preferences!' };
    }
    return { recommendations, error: null };
  } catch (error) {
    console.error(error);
    return { recommendations: null, error: 'An unexpected error occurred while fetching recommendations.' };
  }
}

export async function generatePetBioAction(
  input: GeneratePetBioInput
) {
  'use server';
  const stream = createStreamableValue('');

  (async () => {
    const result = await ai.generate({
      prompt: `You are a creative writer for a pet adoption agency. Your task is to write a warm, friendly, and engaging biography for a pet, from the pet's perspective (in the first person). The goal is to create an emotional connection with potential adopters. Make the bio about 2-3 short paragraphs. Use the following information about the pet: Name: ${input.name}, Species: ${input.species}, Breed: ${input.breed}, Personality Traits: ${input.traits.join(', ')}. Generate the biography.`
    });
    stream.update(result.text);
    stream.done();
  })();

  return { object: null, ui: null, text: stream.value };
}

export async function askVetAssistantAction(
  input: AskVetAssistantInput
) {
    'use server';
    const stream = createStreamableValue('');

    (async () => {
        const result = await ai.generate({
          prompt: `You are an AI Veterinary Assistant for a pet adoption agency. Your role is to provide helpful, general advice based on a pet's profile in response to questions from potential adopters. You are not a real veterinarian and cannot provide medical diagnoses. ALWAYS include a disclaimer in your answer: "Remember, I'm an AI assistant, not a substitute for a real veterinarian. Please consult a professional for any serious health concerns." A user is asking about a pet named ${input.petDetails.name}. Here are the pet's details: Species: ${input.petDetails.species}, Breed: ${input.petDetails.breed}, Age: ${input.petDetails.age}, History: ${input.petDetails.history}, Known Care Requirements: ${input.petDetails.careRequirements}. Here is the user's question: "${input.question}" Please provide a helpful, friendly, and safe answer to their question based *only* on the information provided. Structure your answer in 1-2 paragraphs.`
        });
        stream.update(result.text);
        stream.done();
    })();
    
    return { object: null, ui: null, text: stream.value };
}

export async function generatePetImageAction(
    input: GeneratePetImageInput
): Promise<{ image: GeneratePetImageOutput | null; error: string | null }> {
    try {
        const result = await generatePetImage(input);
        if (!result || !result.imageUrl) {
            return { image: null, error: 'Could not generate an image.' };
        }
        return { image: result, error: null };
    } catch (error) {
        console.error(error);
        return { image: null, error: 'An unexpected error occurred while generating the image.' };
    }
}
