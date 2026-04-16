// Importar Supabase directamente desde Internet (Sin instalaciones extra)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- 🛑 PEGA TUS LLAVES DE SUPABASE AQUÍ 🛑 ---
const supabaseUrl = 'https://mfaumwxtsaovbgpzealp.supabase.co'
const supabaseKey = 'sb_publishable_hm3uhLG5ObKx2Ser0j4GtQ_shWqYFVi'
const supabase = createClient(supabaseUrl, supabaseKey)
// ----------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a los elementos del HTML
    const generateBtn = document.getElementById('generate-btn');
    const ingredientsInput = document.getElementById('ingredients-input');
    const recipeResult = document.getElementById('recipe-result');
    const recipeContent = document.getElementById('recipe-content');
    const loading = document.getElementById('loading');
    const saveRecipeBtn = document.getElementById('save-recipe-btn');
    
    // Referencias de imagen
    const ingredientsImageInput = document.getElementById('ingredients-image');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = imagePreview.querySelector('img');
    const uploadStatusText = document.getElementById('upload-status-text');

    // Referencias de Login
    const authModal = document.getElementById('auth-modal');
    const authMessage = document.getElementById('auth-message');
    const userInfoNav = document.getElementById('user-info');
    const authControlsNav = document.getElementById('auth-controls');
    
    let selectedImageBase64 = null;
    let currentGeneratedMarkdown = ""; // Guardaremos el texto para la base de datos

    // ==========================================
    // SISTEMA DE USUARIOS (SUPABASE)
    // ==========================================

    // 1. Revisar si ya hay un usuario conectado al cargar la página
    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Usuario conectado: Mostrar su email y el botón de guardar
            userInfoNav.classList.remove('hidden');
            authControlsNav.classList.add('hidden');
            document.getElementById('user-email').textContent = user.email;
            saveRecipeBtn.classList.remove('hidden');
        } else {
            // No conectado
            userInfoNav.classList.add('hidden');
            authControlsNav.classList.remove('hidden');
            saveRecipeBtn.classList.add('hidden');
        }
    }
    checkUser();

    // 2. Mostrar/Ocultar ventana de Login
    document.getElementById('show-login-btn').addEventListener('click', () => authModal.classList.remove('hidden'));
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        authModal.classList.add('hidden');
        authMessage.textContent = "";
    });

    // 3. Crear Cuenta (Registro)
    document.getElementById('signup-btn').addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        authMessage.textContent = "Creando cuenta...";
        
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            authMessage.textContent = error.message;
        } else {
            authMessage.style.color = "green";
            authMessage.textContent = "¡Cuenta creada! Ya puedes entrar.";
        }
    });

    // 4. Iniciar Sesión
    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        authMessage.textContent = "Iniciando sesión...";
        
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            authMessage.textContent = "Error: Correo o contraseña incorrectos.";
        } else {
            authModal.classList.add('hidden');
            checkUser(); // Actualiza la barra superior
        }
    });

    // 5. Cerrar Sesión
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        checkUser();
        alert("Has cerrado sesión.");
    });


    // ==========================================
    // LÓGICA DE LA IA Y LA RECETA
    // ==========================================

    // Subir imagen
    ingredientsImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
            selectedImageBase64 = re.target.result.split(',')[1];
            previewImg.src = re.target.result;
            imagePreview.classList.remove('hidden');
            uploadStatusText.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('remove-image-btn').addEventListener('click', () => {
        selectedImageBase64 = null;
        ingredientsImageInput.value = '';
        imagePreview.classList.add('hidden');
        uploadStatusText.classList.remove('hidden');
    });

    // Generar Receta
    generateBtn.addEventListener('click', async () => {
        const ingredientsText = ingredientsInput.value.trim();
        if (!ingredientsText && !selectedImageBase64) {
            alert('Por favor, escribe o sube una foto de tus ingredientes.');
            return;
        }

        generateBtn.disabled = true;
        loading.classList.remove('hidden');
        recipeResult.classList.add('hidden');

        try {
            const response = await fetch('/.netlify/functions/generar-receta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ingredientesTexto: ingredientsText,
                    ingredientesImagenBase64: selectedImageBase64
                })
            });

            if (!response.ok) throw new Error('Error al generar la receta');

            const data = await response.json();
            
            // Guardamos el texto original para la base de datos
            currentGeneratedMarkdown = data.receta;
            
            // Transformamos a HTML bonito para verlo
            recipeContent.innerHTML = marked.parse(currentGeneratedMarkdown);
            recipeResult.classList.remove('hidden');

        } catch (error) {
            alert('Hubo un error al crear tu receta.');
        } finally {
            generateBtn.disabled = false;
            loading.classList.add('hidden');
        }
    });

    // ==========================================
    // GUARDAR RECETA EN LA BASE DE DATOS
    // ==========================================
    saveRecipeBtn.addEventListener('click', async () => {
        saveRecipeBtn.disabled = true;
        saveRecipeBtn.textContent = "Guardando...";

        const { data: { user } } = await supabase.auth.getUser();
        
        // Extraemos la primera línea del texto para usarla como título
        let tituloReceta = currentGeneratedMarkdown.split('\n')[0].replace(/#/g, '').trim();
        if (!tituloReceta) tituloReceta = "Receta Deliciosa";

        const { error } = await supabase
            .from('recetas_guardadas')
            .insert([{ 
                user_id: user.id, 
                titulo: tituloReceta, 
                contenido: currentGeneratedMarkdown 
            }]);

        if (error) {
            alert("Error al guardar: " + error.message);
        } else {
            alert("¡Receta guardada en tu perfil con éxito! 🎉");
        }

        saveRecipeBtn.disabled = false;
        saveRecipeBtn.textContent = "💾 Guardar Receta en mi perfil";
    });

    // ==========================================
    // VER RECETAS GUARDADAS
    // ==========================================
    const viewSavedBtn = document.getElementById('view-saved-btn');
    const savedRecipesModal = document.getElementById('saved-recipes-modal');
    const closeSavedModalBtn = document.getElementById('close-saved-modal-btn');
    const savedRecipesList = document.getElementById('saved-recipes-list');
    const savedRecipesLoading = document.getElementById('saved-recipes-loading');
    const savedRecipesEmpty = document.getElementById('saved-recipes-empty');

    viewSavedBtn.addEventListener('click', async () => {
        savedRecipesModal.classList.remove('hidden');
        savedRecipesList.innerHTML = ''; // Limpiar lista anterior
        savedRecipesLoading.classList.remove('hidden');
        savedRecipesEmpty.classList.add('hidden');

        // Consultar Supabase
        const { data, error } = await supabase
            .from('recetas_guardadas')
            .select('*')
            .order('fecha_creacion', { ascending: false }); // Las más nuevas primero

        savedRecipesLoading.classList.add('hidden');

        if (error) {
            savedRecipesList.innerHTML = `<p style="color: red; text-align: center;">Error al cargar las recetas: ${error.message}</p>`;
            return;
        }

        if (data.length === 0) {
            savedRecipesEmpty.classList.remove('hidden');
            return;
        }

        // Dibujar cada receta en la pantalla
        data.forEach(receta => {
            const recipeCard = document.createElement('div');
            recipeCard.style.cssText = "border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;";
            
            // Formatear la fecha
            const fecha = new Date(receta.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            recipeCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <h3 style="margin: 0; color: #333; font-size: 22px;">${receta.titulo}</h3>
                    <span style="font-size: 12px; color: #888;">Guardada el: ${fecha}</span>
                </div>
                <div class="recipe-container" style="font-size: 14px; max-height: 300px; overflow-y: auto; padding-right: 10px;">
                    ${marked.parse(receta.contenido)}
                </div>
                <button class="secondary-btn delete-recipe-btn" data-id="${receta.id}" style="margin-top: 15px; background-color: #dc3545; width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Eliminar Receta 🗑️</button>
            `;
            savedRecipesList.appendChild(recipeCard);
        });

        // Lógica para el botón de eliminar
        document.querySelectorAll('.delete-recipe-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if(confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
                    const idToDelete = e.target.getAttribute('data-id');
                    e.target.textContent = "Eliminando...";
                    
                    const { error } = await supabase
                        .from('recetas_guardadas')
                        .delete()
                        .eq('id', idToDelete);
                        
                    if(!error) {
                        e.target.parentElement.remove(); // Quitarla de la pantalla
                        if(savedRecipesList.children.length === 0) savedRecipesEmpty.classList.remove('hidden');
                    } else {
                        alert("Error al eliminar: " + error.message);
                        e.target.textContent = "Eliminar Receta 🗑️";
                    }
                }
            });
        });
    });

    closeSavedModalBtn.addEventListener('click', () => {
        savedRecipesModal.classList.add('hidden');
    });

});