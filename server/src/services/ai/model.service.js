import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import {ChatMistralAI} from "@langchain/mistralai"
import {ChatGroq} from "@langchain/groq"
import env from "../../config/dotenv.js"

export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: env.GEMINI_API_KEY
})
export const mistalModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: env.MISTRAL_API_KEY
})
export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: env.GROQ_API_KEY
})