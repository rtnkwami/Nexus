import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function getDashboardInsights(data) {

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

export async function getProductAnalyticsInsights(productData) {
    const responseSchema = {
        type: "object",
        properties: {
            productInsights: {
                type: "object",
                properties: {
                    primaryInsight: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            message: { type: "string" },
                            status: { type: "string", enum: ["positive", "negative", "neutral"] },
                            actionable: { type: "string" }
                        },
                        required: ["title", "message", "status", "actionable"]
                    },
                    performanceBreakdown: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                metric: { type: "string" },
                                explanation: { type: "string" },
                                interpretation: { type: "string" },
                                value: { type: "string" }
                            },
                            required: ["metric", "explanation", "interpretation", "value"]
                        }
                    },
                    actionableRecommendations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                priority: { type: "string", enum: ["high", "medium", "low"] },
                                action: { type: "string" },
                                reasoning: { type: "string" },
                                expectedImpact: { type: "string" }
                            },
                            required: ["priority", "action", "reasoning", "expectedImpact"]
                        }
                    },
                    opportunityAnalysis: {
                        type: "object",
                        properties: {
                            strengths: { type: "array", items: { type: "string" } },
                            improvements: { type: "array", items: { type: "string" } },
                            potentialRevenue: { type: ["string", "null"] }
                        },
                        required: ["strengths", "improvements"]
                    },
                    systemNote: {
                        type: ["object", "null"],
                        properties: {
                            type: { type: "string", enum: ["warning", "info", "data_quality"] },
                            message: { type: "string" }
                        },
                        required: ["type", "message"]
                    }
                },
                required: ["primaryInsight", "performanceBreakdown", "actionableRecommendations", "opportunityAnalysis", "systemNote"]
            }
        },
        required: ["productInsights"]
    };

    const prompt = `
    You are a data-driven product performance analyst. Your job is to accurately analyze sales data and provide insights based on what the data actually shows, not assumptions.

    **ANALYSIS APPROACH:**
    1. Calculate key metrics from the provided data
    2. Identify what the data actually shows about customer behavior
    3. Recommend strategies based solely on the observed patterns

    **KEY METRICS TO CALCULATE:**
    - Total revenue, units sold, orders
    - Average order value (revenue ÷ orders)  
    - Average units per order (units ÷ orders)
    - Monthly trends and patterns

    **CRITICAL:** Base all insights strictly on the data provided. Let the numbers guide your conclusions, not preconceived notions about customer behavior patterns.

    Format monetary values with ₵ symbol.

    **Data to analyze:**
    ${JSON.stringify(productData, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",  
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema
        }
    });
    return JSON.parse(response.text);
}