import { AuraAPI } from "./api";
import { Message } from "../types";

// Neural Chat relay to Aura Backend
export const chatWithGemini = async (
  messages: Message[], 
  onChunk: (chunk: string) => void
) => {
  return AuraAPI.chat(messages, onChunk);
};

// Terminal Command Execution through Aura Backend
export const terminalCommand = async (command: string) => {
  return AuraAPI.terminalCommand(command);
};

// Maps & Grounding Query through Aura Backend
export const getMapsInfo = async (query: string, lat: number, lng: number) => {
  return AuraAPI.getMapsInfo(query, lat, lng);
};