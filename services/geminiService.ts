import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function redactText(text: string): Promise<string> {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are an expert redaction system specializing in data privacy. Your task is to analyze the provided text and perform two specific actions:

1.  **Redact Sensitive Information (PII & PHI):**
    *   **Personal Identifiable Information (PII):** Names, addresses, phone numbers, email addresses, and financial information (e.g., "Visa ending in 4321").
    *   **Protected Health Information (PHI):** Medical record numbers, patient identifiers, specific medical diagnoses/conditions/treatments, medication names, healthcare provider names, hospital/clinic names, and health insurance information.
    *   Replace the redacted information with clear, generic placeholders in brackets. Use the following placeholders:
        *   Names: [REDACTED_NAME]
        *   Addresses: [REDACTED_ADDRESS]
        *   Phone Numbers: [REDACTED_PHONE]
        *   Email Addresses: [REDACTED_EMAIL]
        *   Financial Info: [REDACTED_FINANCIAL_INFO]
        *   Medical Conditions/Diagnoses: [REDACTED_MEDICAL_CONDITION]
        *   Medical Procedures/Treatments: [REDACTED_PROCEDURE]
        *   Medications: [REDACTED_MEDICATION]
        *   Healthcare Providers: [REDACTED_PROVIDER]
        *   Organizations/Hospitals: [REDACTED_ORGANIZATION]
        *   Medical/Insurance IDs: [REDACTED_ID]
        *   Insurance Info: [REDACTED_INSURANCE_INFO]

2.  **Dateshift All Dates:**
    *   Identify all dates within the text, including full dates, birth dates, and relative dates (e.g., "in two weeks").
    *   Find the earliest date mentioned in the document.
    *   Remap this earliest date to January 1, 1920.
    *   Shift all other dates in the document forward by the same time interval, preserving the relative time differences between them. For example, if two original dates were 7 days apart, their new dateshifted versions should also be 7 days apart. Express the new dates in the same format as the original (e.g., YYYY-MM-DD).

**IMPORTANT RULES:**
- Preserve the original structure and formatting of the text as much as possible.
- Only return the modified text.
- DO NOT include any explanations, apologies, or introductory/concluding remarks in your response.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Here is the text to process:\n---\n${text}\n---`,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.0,
            }
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI service failed to process the request.");
    }
}
