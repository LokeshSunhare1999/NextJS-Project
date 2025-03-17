import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai"

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, args) => {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: "Today is a wonderful day to build something people love!",
      });
    return "success";
  },
});