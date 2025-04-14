/**
 * Funcionalidad JavaScript para el sistema de Confesiones Anónimas
 * Implementa interacciones, animaciones y manejo de formularios
 */

document.addEventListener('DOMContentLoaded', function() {
    // Favoritos - Ajax para Corazones
    const favoriteForms = document.querySelectorAll('.favorite-form');
    favoriteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button');
            const icon = button.querySelector('i');
            const countElement = button.querySelector('.favorite-count') || button.childNodes[2];
            let count = parseInt(countElement ? countElement.textContent : 0);
            
            // Animación del corazón
            icon.style.transform = 'scale(1.5)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 300);
            
            // Cambio visual inmediato (optimistic UI)
            if (button.classList.contains('text-danger')) {
                button.classList.remove('text-danger');
                button.classList.add('text-muted');
                if (countElement && count > 0) {
                    countElement.textContent = count - 1;
                }
            } else {
                button.classList.remove('text-muted');
                button.classList.add('text-danger');
                if (countElement) {
                    countElement.textContent = count + 1;
                }
            }
            
            // Enviar solicitud AJAX
            fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: new URLSearchParams(new FormData(this))
            })
            .then(response => response.json())
            .then(data => {
                // Si la respuesta del servidor no coincide con nuestra interfaz optimista, corregir
                if (data.is_favorite && !button.classList.contains('text-danger')) {
                    button.classList.remove('text-muted');
                    button.classList.add('text-danger');
                } else if (!data.is_favorite && button.classList.contains('text-danger')) {
                    button.classList.remove('text-danger');
                    button.classList.add('text-muted');
                }
                
                // Actualizar contador con valor exacto del servidor
                if (countElement) {
                    countElement.textContent = data.count;
                }
            })
            .catch(error => {
                console.error('Error en la operación de favorito:', error);
                // Revertir cambios visuales en caso de error
                if (button.classList.contains('text-danger')) {
                    button.classList.remove('text-danger');
                    button.classList.add('text-muted');
                } else {
                    button.classList.remove('text-muted');
                    button.classList.add('text-danger');
                }
                if (countElement) {
                    countElement.textContent = count; // Restaurar valor original
                }
            });
        });
    });
    
    // Contador de caracteres para formularios de confesión
    const confessionTextarea = document.getElementById('confessionText');
    const characterCounter = document.getElementById('characterCount');
    
    if (confessionTextarea && characterCounter) {
        confessionTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 1000;
            const remainingChars = maxLength - currentLength;
            
            characterCounter.textContent = `${currentLength}/${maxLength} caracteres`;
            
            if (currentLength > maxLength * 0.8) {
                characterCounter.classList.add('text-warning');
            } else {
                characterCounter.classList.remove('text-warning');
            }
            
            if (currentLength > maxLength * 0.95) {
                characterCounter.classList.add('text-danger');
                characterCounter.classList.remove('text-warning');
            } else {
                characterCounter.classList.remove('text-danger');
            }
        });
        
        // Disparar el evento inicialmente para establecer el contador
        confessionTextarea.dispatchEvent(new Event('input'));
    }
    
    // Animación para las tarjetas de confesión
    const confessionCards = document.querySelectorAll('.confession-card');
    const animateOnScroll = function() {
        confessionCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Si la tarjeta está visible en la ventana
            if (cardPosition.top < windowHeight * 0.9) {
                card.classList.add('visible');
            }
        });
    };
    
    // Inicialmente, agregar la clase para las tarjetas visibles
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Configuración del modo oscuro/claro
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Establecer tema inicial
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Animación para nuevos comentarios
    const commentForm = document.querySelector('form[action*="comment"]');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            const commentText = this.querySelector('textarea').value.trim();
            if (commentText.length < 2) {
                e.preventDefault();
                alert('El comentario debe tener al menos 2 caracteres.');
            } else {
                // Animación de envío
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Enviando...';
                submitButton.disabled = true;
            }
        });
    }
    
    // Tooltips para elementos con data-tooltip
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.setAttribute('title', element.getAttribute('data-tooltip'));
        element.addEventListener('mouseenter', function() {
            this.classList.add('tooltip-active');
        });
        element.addEventListener('mouseleave', function() {
            this.classList.remove('tooltip-active');
        });
    });
});