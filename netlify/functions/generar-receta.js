const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const ingredientes = body.ingredientes;
        const apiKey = process.env.GEMINI_API_KEY;

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // ¡AQUÍ ESTÁ LA SOLUCIÓN! Usamos el modelo exacto que vimos en tu consola
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Eres un chef experto creativo y un defensor de la reducción del desperdicio de alimentos.
        El usuario tiene los siguientes ingredientes en su nevera/despensa: ${ingredientes}.
        
        Tu tarea es crear una receta deliciosa y fácil de seguir utilizando principalmente estos ingredientes. 
        Puedes asumir que el usuario tiene ingredientes básicos de despensa como sal, pimienta, aceite y agua.
        
        Formato de salida requerido:
        1. Un título creativo para la receta.
        2. Tiempo estimado de preparación.
        3. Lista de ingredientes (indicando los aportados y los básicos).
        4. Instrucciones paso a paso numeradas.
        
        Responde en español y de forma entusiasta.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receta: responseText })
        };

    } catch (error) {
        console.error("Error llamando a Gemini:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error al generar la receta." }) };
    }
};