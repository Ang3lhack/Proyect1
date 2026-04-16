const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const ingredientsText = body.ingredientesTexto;
        const ingredientsImageBase64 = body.ingredientesImagenBase64;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: "API Key no encontrada en el entorno." }) };
        }

        // Inicializar Gemini con la clave API 
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // AQUÍ ESTÁ LA CORRECCIÓN: Usamos el modelo 2.5 que tu cuenta permite
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt;
        const generativeParts = [];

        if (ingredientsImageBase64) {
            // Caso 1: Hay imagen
            const imagePart = {
                inlineData: {
                    data: ingredientsImageBase64,
                    mimeType: "image/jpeg" 
                }
            };
            generativeParts.push(imagePart);

            prompt = `
            Eres un chef experto creativo. He adjuntado una foto de los ingredientes que tengo. 
            Analiza la imagen para identificarlos.
            ${ingredientsText ? `Además de lo que ves en la foto, también tengo: ${ingredientsText}.` : ""}
            
            Crea una receta deliciosa y fácil. Puedes asumir que tengo sal, pimienta, aceite y agua.
            Formato requerido (en español):
            # Título Creativo de la Receta
            ### Tiempo estimado: XX minutos
            **Ingredientes:** (Lista con viñetas)
            **Instrucciones:** (Lista numerada paso a paso)
            `;
        } else {
            // Caso 2: Solo texto
            prompt = `
            Eres un chef experto creativo. El usuario tiene estos ingredientes: ${ingredientsText}.
            
            Crea una receta deliciosa y fácil. Puedes asumir que tiene sal, pimienta, aceite y agua.
            Formato requerido (en español):
            # Título Creativo de la Receta
            ### Tiempo estimado: XX minutos
            **Ingredientes:** (Lista con viñetas)
            **Instrucciones:** (Lista numerada paso a paso)
            `;
        }

        generativeParts.push(prompt);

        // Generar contenido
        const result = await model.generateContent(generativeParts);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receta: responseText })
        };

    } catch (error) {
        console.error("Error crítico llamando a Gemini:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno del servidor", details: error.message })
        };
    }
};