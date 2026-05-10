import { askAssistant } from "../services/chatbot.service.js";

export async function askChatbot(req, res, next) {
  try {
    const answer = await askAssistant(req.body.message || "");
    res.json({ answer });
  } catch (error) {
    next(error);
  }
}
