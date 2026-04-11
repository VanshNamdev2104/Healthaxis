import { START, END, StateSchema, StateGraph, CompiledStateGraph } from "@langchain/langgraph"
import * as z from "zod";
import { geminiModel, mistalModel, groqModel } from "./model.service.js";
import { HumanMessage, AIMessage, SystemMessage, createAgent, providerStrategy } from "langchain"

const language = "hinglish" // default ai response language

const extractJson = (text) => {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
}
const stateSchema = z.object({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge_solution: z.object({
        best_solution: z.enum(["solution_1", "solution_2"]).default("solution_1"),
        score: z.object({
            solution_1_score: z.object({
                accuracy: z.number().min(0).max(10).default(0),
                relevance: z.number().min(0).max(10).default(0),
                completeness: z.number().min(0).max(10).default(0),
                safety: z.number().min(0).max(10).default(0),
                clarity: z.number().min(0).max(10).default(0),
                overall: z.number().min(0).max(10).default(0)
            }),
            solution_2_score: z.object({
                accuracy: z.number().min(0).max(10).default(0),
                relevance: z.number().min(0).max(10).default(0),
                completeness: z.number().min(0).max(10).default(0),
                safety: z.number().min(0).max(10).default(0),
                clarity: z.number().min(0).max(10).default(0),
                overall: z.number().min(0).max(10).default(0)
            })
        }),
        reason: z.string().default(""),
        emergency: z.object({
            status: z.boolean().default(false),
            emergency_reason: z.string().default("")
        }),
        improvements: z.object({
            solution_1_improvements: z.string().default(""),
            solution_2_improvements: z.string().default("")
        })
    }),
    final_solution: z.object({
        possible_disease: z.string().default(""),
        confidence_score: z.number().min(0).max(100).default(0),
        severity: z.enum(["low", "medium", "high"]).default("low"),
        explanation: z.string().default(""),
        medical_sol: z.array(
            z.object({
                medicine_name: z.string(),
                type: z.enum(["tablet", "syrup", "capsule", "injection", "other"]),
                dosage: z.string(), // e.g., "500mg twice a day"
                timing: z.string(), // e.g., "after food", "before sleep"
                duration: z.string(), // e.g., "3-5 days"
                purpose: z.string(), // why this medicine
                otc: z.boolean(), // over-the-counter or not (true : No Doctor permission required, False :required)
                warnings: z.array(z.string()).optional()
            })
        ),
        home_remedies: z.array(
            z.object({
                remedy_name: z.string(),
                ingredients: z.array(z.string()),
                preparation: z.string(), // kaise banana hai
                usage: z.string(), // kaise lena/use karna hai
                frequency: z.string(), // kitni baar
                benefits: z.string(), // kya fayda
                precautions: z.array(z.string()).optional()
            })
        ),
        care_tips: z.array(
            z.object({
                tip: z.string(),
                category: z.enum([
                    "diet",
                    "hydration",
                    "rest",
                    "hygiene",
                    "activity",
                    "lifestyle"
                ]),
                description: z.string(),
                priority: z.enum(["low", "medium", "high"]).optional()
            })
        ),
        consult_doctor_if: z.array(
            z.object({
                condition: z.string().default(""),
                time_frame: z.string().default(""), // e.g., "after 3 days", "immediately"
                reason: z.string().default(""), // why doctor needed
                action: z.string().default("") // what user should do
            })
        ),
        disclaimer: z.string().default("")
    })
})

// const state = new StateSchema(stateSchema);


const solutionNode = async (state) => {
    const { problem } = state;

    const [mistalRes, groqRes] = await Promise.all([
        mistalModel.invoke(`
            You are a medical assistant.
            - Respond ONLY in ${language} (${language} + simple English mix)
            - Use simple, easy-to-understand language
            - Keep tone like a doctor explaining to a normal Indian user

            Respond strictly in this format:

            Possible disease
            confidance Score
            saverity : [low, moderate, high]
            explanation
            medical sol
            Home remedies sol
            care tips
            consult doctor if
            disclamer

            Problem: ${problem}
        `),
        groqModel.invoke(`
            You are a medical assistant.

            Respond in this format:

            Possible disease
            confidance Score
            saverity : [low, moderate, high]
            explanation
            medical sol
            Home remedies sol
            care tips
            consult doctor if
            disclamer

            Problem: ${problem}
        `)
    ]);

    const solution_1 = mistalRes?.content || mistalRes?.text || String(mistalRes);
    const solution_2 = groqRes?.content || groqRes?.text || String(groqRes);
    return {
        solution_1,
        solution_2
    }
}

const judgeNode = async (state) => {
    const { problem, solution_1, solution_2 } = state;

    const judge = createAgent({
        model: geminiModel,
        // responseFormat: providerStrategy(z.object({

        // })),
        systemPrompt: `
        You are an expert Medical AI Judge and Clinical Decision Evaluator.
        use only clear ${language} language.

        You will be given:
        - Problem (patient symptoms or health issue)
        - Solution 1 (from AI model A)
        - Solution 2 (from AI model B)

        Your job has TWO parts:

        ━━━━━━━━━━━━━━━━━━━━━━
        TASK 1: EVALUATION
        ━━━━━━━━━━━━━━━━━━━━━━
        Carefully evaluate both solutions based on:

        1. Accuracy (medical correctness)
        2. Relevance (how well it matches symptoms)
        3. Completeness (coverage of diagnosis + treatment)
        4. Safety (MOST IMPORTANT - avoid harmful advice)
        5. Clarity (how easy it is to understand)

        Give each category a score from 0 to 10.

        Then compute an overall score for each solution.

        ━━━━━━━━━━━━━━━━━━━━━━
        TASK 2: DECISION
        ━━━━━━━━━━━━━━━━━━━━━━
        Select the best solution based on:

        Priority order:
        1. Safety (highest priority)
        2. Accuracy
        3. Completeness
        4. Relevance
        5. Clarity

        If a solution has any unsafe or risky medical suggestion, it must be penalized heavily.

        ━━━━━━━━━━━━━━━━━━━━━━
        TASK 3: FINAL MEDICAL OUTPUT
        ━━━━━━━━━━━━━━━━━━━━━━
        From ONLY the winning solution:

        - Extract and reconstruct a clean structured medical response.
        - Do NOT mix information from both solutions.
        - If information is missing, infer carefully but do NOT hallucinate dangerous medical facts.

        ━━━━━━━━━━━━━━━━━━━━━━
        EMERGENCY DETECTION RULE
        ━━━━━━━━━━━━━━━━━━━━━━
        If symptoms suggest serious conditions (chest pain, breathing issues, stroke, severe fever, unconsciousness):

        - Set emergency.status = true
        - Provide clear emergency_reason
        - Recommend immediate medical attention

        LANGUAGE & TONE RULE
        ━━━━━━━━━━━━━━━━━━━━━━
        - Always respond in simple and clear ${language} language. 
        - Use professional medical tone like a trained doctor.
        - Avoid slang, casual words, or informal chat style.
        - Keep explanations easy to understand for common users in India.
        - If needed, use English only for medical terms (e.g., “fever”, “infection”, “dosage”).
        - Do not use emotional or dramatic language.

        ━━━━━━━━━━━━━━━━━━━━━━
        MEDICAL COMMUNICATION STYLE
        ━━━━━━━━━━━━━━━━━━━━━━
        - Act like a professional clinical assistant.
        - Provide structured, step-by-step medical guidance.
        - Be calm, neutral, and factual.
        - Do not make absolute guarantees about diagnosis.
        - Always prioritize patient safety and recommend doctor consulta

        ━━━━━━━━━━━━━━━━━━━━━━
        OUTPUT RULES (STRICT)
        ━━━━━━━━━━━━━━━━━━━━━━
        - Follow the provided schema strictly.
        - Do not include extra text.
        - Do NOT mix both solutions.
        - Safety is highest priority.
        - No markdown
        - No commentary

        Return STRICT VALID JSON ONLY.
        No explanation. No markdown.

        Structure:

        {
        "judge_solution": {
            "best_solution": "solution_1 | solution_2",

            "score": {
            "solution_1_score": {
                "accuracy": number,
                "relevance": number,
                "completeness": number,
                "safety": number,
                "clarity": number,
                "overall": number
            },
            "solution_2_score": {
                "accuracy": number,
                "relevance": number,
                "completeness": number,
                "safety": number,
                "clarity": number,
                "overall": number
            }
            },

            "reason": "string",

            "emergency": {
            "status": boolean,
            "emergency_reason": "string"
            },

            "improvements": {
            "solution_1_improvements": "string",
            "solution_2_improvements": "string"
            }
        },

        "final_solution": {
            "possible_disease": "string",
            "confidence_score": number,
            "severity": "low | medium | high",
            "explanation": "string",

            "medical_sol": [
            {
                "medicine_name": "string",
                "type": "tablet | syrup | capsule | injection | other",
                "dosage": "string",
                "timing": "string",
                "duration": "string",
                "purpose": "string",
                "otc": boolean,
                "warnings": ["string"]
            }
            ],

            "home_remedies": [
            {
                "remedy_name": "string",
                "ingredients": ["string"],
                "preparation": "string",
                "usage": "string",
                "frequency": "string",
                "benefits": "string",
                "precautions": ["string"]
            }
            ],

            "care_tips": [
            {
                "tip": "string",
                "category": "diet | hydration | rest | hygiene | activity | lifestyle",
                "description": "string",
                "priority": "low | medium | high"
            }
            ],

            "consult_doctor_if": [
            {
                "condition": "string",
                "time_frame": "string",
                "reason": "string",
                "action": "string"
            }
            ],

            "disclaimer": "string"
        }
        }
        ━━━━━━━━━━━━━━━━━━━━━━
        IMPORTANT MEDICAL SAFETY RULE
        ━━━━━━━━━━━━━━━━━━━━━━
        This system is for informational support only and does not replace a real doctor.
        Always prioritize safe, conservative medical advice.
        `
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(`
                Problem: ${problem}

                Solution 1: ${solution_1}

                Solution 2: ${solution_2}

                Task:
                Evaluate both solutions strictly according to the system instructions.

                Be strict about medical safety and do not mix both solutions.
                use only ${language} language.
                `)
        ]
    })

    // const { judge_solution, final_solution } = judgeResponse.structuredResponse
    console.log(judgeResponse,"This is judge Response");
    
    const parsed = extractJson(judgeResponse.messages[1].content);
    const result = stateSchema.parse(parsed);
    const {judge_solution, final_solution} = result
    return {
        judge_solution,
        final_solution
    }
}

const graph = new StateGraph(stateSchema)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

export default async function (problem) {
    if (!problem || typeof problem !== "string") {
        throw new Error("Invalid problem input");
    }

    return await graph.invoke({ problem });
}