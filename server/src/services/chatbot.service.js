export async function askAssistant(message) {
  if (process.env.AI_PROVIDER === "deepseek" && process.env.DEEPSEEK_API_KEY) {
    return "DeepSeek integration is configured next; wire the provider request in chatbot.service.js.";
  }

  if (process.env.AI_PROVIDER === "huggingface" && process.env.HUGGINGFACE_API_KEY) {
    return "Hugging Face integration is configured next; wire the provider request in chatbot.service.js.";
  }

  return `Mock assistant: I can help analyze "${message}" once your AI provider key is connected.`;
}
