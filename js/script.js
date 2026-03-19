document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const ingredientsInput = document.getElementById('ingredients-input');
    const recipeResult = document.getElementById('recipe-result');
    const loading = document.getElementById('loading');

    generateBtn.addEventListener('click', async () => {
        const ingredients = ingredientsInput.value.trim();

        if (!ingredients) {
            alert('Por favor, ingresa algunos ingredientes primero.');
            return;
        }

        // Preparar la UI para la carga
        generateBtn.disabled = true;
        loading.classList.remove('hidden');
        recipeResult.classList.add('hidden');
        recipeResult.innerHTML = '';

        try {
            // Llamar a la Netlify Function (nuestro backend)
            const response = await fetch('/.netlify/functions/generar-receta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredientes: ingredients })
            });

            if (!response.ok) {
                throw new Error('Error al generar la receta');
            }

            const data = await response.json();
            
            // Mostrar la receta (Gemini devuelve Markdown, lo formateamos un poco)
            const formattedRecipe = formatMarkdown(data.receta);
            recipeResult.innerHTML = formattedRecipe;
            recipeResult.classList.remove('hidden');

        } catch (error) {
            console.error('Error:', error);
            recipeResult.innerHTML = '<p style="color: red;">Hubo un error al crear tu receta. Inténtalo de nuevo.</p>';
            recipeResult.classList.remove('hidden');
        } finally {
            generateBtn.disabled = false;
            loading.classList.add('hidden');
        }
    });

    // Función súper básica para convertir el Markdown de Gemini a HTML
    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negritas
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Cursivas
            .replace(/\n/g, '<br>'); // Saltos de línea
    }
});