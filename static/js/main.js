/**
 * Funcionalidad JavaScript principal para Confesiones Anónimas
 * Incluye mejoras visuales, interactividad y animaciones para toda la aplicación
 */

document.addEventListener('DOMContentLoaded', function() {
    // Añadir clase al cuerpo después de cargar para permitir animaciones de entrada
    document.body.classList.add('loaded');
    
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length) {
        Array.from(tooltipTriggerList).map(tooltipTriggerEl => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Inicializar popovers de Bootstrap
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popoverTriggerList.length) {
        Array.from(popoverTriggerList).map(popoverTriggerEl => {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
    // Animación para elementos con clase 'fade-in'
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    }
    
    // Animación para elementos con clase 'slide-in'
    const slideElements = document.querySelectorAll('.slide-in');
    if (slideElements.length) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    slideObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        slideElements.forEach(element => {
            slideObserver.observe(element);
        });
    }
    
    // Añadir efectos a los botones
    const buttons = document.querySelectorAll('.btn:not(.btn-link)');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Desvanecimiento automático de alertas
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Manejar menús colapsables en móvil
    const navbar = document.querySelector('.navbar-collapse');
    if (navbar) {
        document.addEventListener('click', function(event) {
            const isNavbarToggler = event.target.closest('.navbar-toggler');
            const isNavbarCollapse = event.target.closest('.navbar-collapse');
            
            if (!isNavbarToggler && !isNavbarCollapse && navbar.classList.contains('show')) {
                const bsNavbar = new bootstrap.Collapse(navbar);
                bsNavbar.hide();
            }
        });
    }
    
    // Añadir efecto parallax a elementos de fondo
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                element.style.transform = `translateY(${scrollTop * speed}px)`;
            });
        });
    }
    
    // Inicializar contador de notificaciones
    const updateNotificationCount = () => {
        const notificationBadges = document.querySelectorAll('.notification-badge');
        
        notificationBadges.forEach(badge => {
            const count = parseInt(badge.getAttribute('data-count') || '0');
            
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.classList.remove('d-none');
                badge.classList.add('animate__animated', 'animate__pulse');
            } else {
                badge.classList.add('d-none');
            }
        });
    };
    
    // Inicializar el contador al cargar
    updateNotificationCount();
    
    // Iniciar avatares generados
    if (window.avatarGenerator) {
        window.avatarGenerator.initAvatars();
    }
});