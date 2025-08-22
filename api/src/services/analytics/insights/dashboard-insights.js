import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default async function getDashboardInsights(data) {

    const responseSchema = {
            type: "object",
            properties: {
                businessInsights: {
                type: "object",
                properties: {
                    primaryInsight: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            message: { type: "string" },
                            status: { type: "string", enum: ["positive", "negative", "neutral"] },
                            metricValue: { type: ["string", "null"] }
                        },
                        required: ["title", "message", "status", "metricValue"]
                    },
                    keyMetrics: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                definition: { type: "string" },
                                value: { type: "string" },
                                change: { type: "string" },
                                status: { type: "string", enum: ["positive", "negative"] }
                            },
                            required: ["name", "value", "change", "status"]
                        }
                    },
                    recommendations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            text: { type: "string" }
                            },
                            required: ["text"]
                        }
                    },
                    systemNote: {
                        type: ["object", "null"],
                        properties: {
                            type: { type: "string", enum: ["error", "note"] },
                            message: { type: "string" }
                        },
                        required: ["type", "message"]
                    }
                },
                    required: ["primaryInsight", "keyMetrics", "recommendations", "systemNote"]
                }
            },
            required: ["businessInsights"]
            };




  const prompt = `
    You are an expert business intelligence AI integrated into an e-commerce dashboard. 
    Analyze the given data and generate insights in the required JSON structure.

    **Requirements:**
    - Make sure to define what each metric means in plain language (e.g., "Average Order Value represents how much customers spend per order").
    - Make sure to interpret the *value* of each metric, especially key metrics (not just whether it went up or down).
    - Highlight the most critical insight (prioritize negative changes like a drop in conversion).
    - Always format monetary values with the Ghanaian Cedi symbol (₵).
    - Do NOT recommend:
    - Delivery, logistics, or shipping strategies
    - Advertising, marketing campaigns, or external promotions
    - Checkout or platform-level improvements (sellers have no control here)
    - Repeat customer analysis beyond the single rate value provided
    - Recommendations must focus ONLY on what sellers can influence:
    - Product catalog adjustments
    - Pricing strategies
    - Bundling or upselling with existing products
    - Inventory / stock management
    - Use systemNote **only for anomalies** (e.g., unrealistic values, 0% change where unexpected, data inconsistencies).

    **Data to analyze:**
    ${JSON.stringify(data, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema
    }
  });

  console.log("Insights:", response.text);
  return JSON.parse(response.text);
}
