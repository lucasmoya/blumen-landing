// Background Slideshow Animation
// Professional fade animation for hero background images

(function() {
    'use strict';

    // Configuración
    const FADE_DURATION = 2000; // Duración del fade en milisegundos (debe coincidir con CSS)
    const ZOOM_DURATION = 5000; // Duración del zoom (5 segundos)
    const DISPLAY_DURATION = ZOOM_DURATION; // Tiempo que cada imagen se muestra (igual al zoom)
    const TOTAL_DURATION = DISPLAY_DURATION;

    // Pre-cargar todas las imágenes para evitar flashes
    function preloadImages(callback) {
        const imagePaths = [];
        for (let i = 1; i <= 6; i++) {
            imagePaths.push(`public/background-index/${i}.jpg`);
        }

        let loadedCount = 0;
        const images = [];

        imagePaths.forEach((path, index) => {
            const img = new Image();
            img.onload = function() {
                loadedCount++;
                if (loadedCount === imagePaths.length && callback) {
                    callback();
                }
            };
            img.onerror = function() {
                loadedCount++;
                if (loadedCount === imagePaths.length && callback) {
                    callback();
                }
            };
            img.src = path;
            images.push(img);
        });

        return images;
    }

    // Inicializar el slideshow
    function initSlideshow() {
        const slides = document.querySelectorAll('.hero-slide');
        
        if (slides.length === 0) {
            console.warn('No se encontraron slides para el hero');
            return;
        }

        let currentIndex = 0;
        let nextIndex = 1;
        let intervalId = null;

        // Función para cambiar a la siguiente imagen
        function nextSlide() {
            const currentSlide = slides[currentIndex];
            const nextSlide = slides[nextIndex];

            if (!currentSlide || !nextSlide) return;

            // Reiniciar la animación de zoom removiendo y agregando la clase
            // Esto asegura que la animación se reinicie cada vez
            if (nextSlide.classList.contains('active')) {
                nextSlide.classList.remove('active');
                void nextSlide.offsetHeight; // Forzar reflow
            }
            
            // Agregar la clase active a la siguiente imagen
            // Esto iniciará el fade-in y zoom-in de la nueva imagen
            nextSlide.classList.add('active');
            
            // Forzar reflow para asegurar que el navegador procese el cambio
            // antes de remover la clase de la imagen actual
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Capturar el transform actual de la imagen que se va a ocultar
                    // para mantenerlo durante el fade out
                    const computedStyle = window.getComputedStyle(currentSlide);
                    const currentTransform = computedStyle.transform;
                    
                    // Aplicar el transform actual para mantenerlo durante el fade out
                    // Asegurarse de incluir translateZ(0) para aceleración por hardware
                    if (currentTransform && currentTransform !== 'none') {
                        // Si el transform no incluye translateZ, agregarlo
                        if (!currentTransform.includes('translateZ')) {
                            currentSlide.style.transform = currentTransform.replace('matrix', 'translateZ(0) matrix');
                        } else {
                            currentSlide.style.transform = currentTransform;
                        }
                    } else {
                        currentSlide.style.transform = 'translateZ(0) scale(1)';
                    }
                    
                    // Remover la clase active de la imagen actual
                    // Esto iniciará el fade-out mientras la nueva imagen hace fade-in
                    currentSlide.classList.remove('active');
                    
                    // Resetear el zoom de la imagen anterior DESPUÉS del fade out
                    // Esto evita el salto visual
                    setTimeout(() => {
                        // Remover el transform inline para permitir que el reset funcione
                        currentSlide.style.transform = '';
                        currentSlide.classList.add('resetting');
                        void currentSlide.offsetHeight; // Forzar reflow
                        currentSlide.classList.remove('resetting');
                    }, FADE_DURATION);
                });
            });

            // Actualizar índices
            currentIndex = nextIndex;
            nextIndex = (nextIndex + 1) % slides.length;
        }

        // Iniciar el ciclo de transiciones
        function startSlideshow() {
            // Iniciar el intervalo inmediatamente para que todas las imágenes tengan la misma duración
            // La primera imagen ya está activa desde el HTML, así que empezará el ciclo después de DISPLAY_DURATION
            intervalId = setInterval(nextSlide, DISPLAY_DURATION);
        }

        // Pre-cargar imágenes y luego iniciar
        preloadImages(() => {
            // Las imágenes están cargadas, iniciar el slideshow
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startSlideshow);
            } else {
                startSlideshow();
            }
        });

        // Limpiar intervalo cuando la página se oculta (para ahorrar recursos)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            } else {
                if (!intervalId) {
                    startSlideshow();
                }
            }
        });
    }

    // Inicializar cuando el script se carga
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideshow);
    } else {
        initSlideshow();
    }

})();
