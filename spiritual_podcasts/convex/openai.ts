// import { action } from "./_generated/server";
// import { v } from "convex/values";

// import OpenAI from "openai";
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

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