// import { action } from "./_generated/server";
// import { v } from "convex/values";

import OpenAI from "openai";
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// export const generateAudioAction = action({
//   args: { input: v.string(), voice: v.string() },
//   handler: async (_, { voice, input }) => {
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: voice as SpeechCreateParams['voice'],
//       input,
//     });

//     const buffer = await mp3.arrayBuffer();
    
//     return buffer;
//   },
// });

import { action } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    // Map the voice parameter to actual ElevenLabs voice IDs
    // Replace these with actual voice IDs from your ElevenLabs account
    const voiceMapping = {
      "male": "pNInz6obpgDQGcFmaJgB", // Example ID for a male voice
      "female": "21m00Tcm4TlvDq8ikWAM", // Example ID for a female voice
      "default": "EXAVITQu4vr4xnSDxMaL" // Default voice ID
    };
    
    // Use the mapped voice ID or fall back to default
    const voiceId = voiceMapping[voice] || voiceMapping.default;
    
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        data: {
          text: input,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        },
        responseType: 'arraybuffer'
      });
      
      return response.data;
    } catch (error) {
      // Better error handling
      console.error("ElevenLabs API Error:", error.response?.data || error.message);
      throw new Error(`Text-to-speech failed: ${error.message}`);
    }
  },
});

// export const generateThumbnailAction = action({
//   args: { prompt: v.string() },
//   handler: async (_, { prompt }) => {
//     const response = await openai.images.generate({
//       model: 'dall-e-3',
//       prompt,
//       size: '1024x1024',
//       quality: 'standard',
//       n: 1,
//     })

//     const url = response.data[0].url;

//     if(!url) {
//       throw new Error('Error generating thumbnail');
//     }

//     const imageResponse = await fetch(url);
//     const buffer = await imageResponse.arrayBuffer();
//     return buffer;
//   }
// })


export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
    
    if (!STABILITY_API_KEY) {
      throw new Error("Missing Stability API key");
    }
    
    try {
      // Call Stability AI's text-to-image API
      const response = await axios({
        method: 'POST',
        url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${STABILITY_API_KEY}`
        },
        data: {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30
        },
        responseType: 'json'
      });
      
      // Extract the image data (base64 encoded)
      const generatedImage = response.data.artifacts[0].base64;
      
      if (!generatedImage) {
        throw new Error('No image data returned from Stability AI');
      }
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(generatedImage);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return bytes.buffer;
    } catch (error) {
      console.error("Stability AI Error:", error.response?.data || error.message);
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
  }
})