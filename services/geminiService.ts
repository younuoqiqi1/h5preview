import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCodeFromPrompt = async (prompt: string): Promise<string> => {
  const ai = getClient();
  
  const systemPrompt = `
    You are an expert frontend engineer. 
    Your task is to generate a single, self-contained HTML file based on the user's request.
    
    Rules:
    1. The output MUST be valid HTML5.
    2. Include internal CSS within <style> tags.
    3. Include internal JS within <script> tags.
    4. You may use CDNs for libraries like Tailwind CSS, Bootstrap, Vue, React (UMD), FontAwesome, etc., if appropriate for the request.
    5. Do not output markdown code blocks (like \`\`\`html). Output ONLY the raw code string.
    6. Ensure the design is modern, responsive, and visually appealing.
    7. If the user asks for a component, wrap it in a nice page layout.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemPrompt
      }
    });

    let code = response.text || "";
    
    // Cleanup if the model accidentally wraps in markdown
    code = code.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    
    return code;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};