document.addEventListener('DOMContentLoaded', function() {
    // Handle favorite toggle with AJAX
    const favoriteForms = document.querySelectorAll('.favorite-form');
    
    favoriteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formAction = this.getAttribute('action');
            const favoriteButton = this.querySelector('button');
            const heartIcon = favoriteButton.querySelector('i');
            
            fetch(formAction, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update heart icon
                    if (data.is_favorite) {
                        favoriteButton.classList.remove('text-muted');
                        favoriteButton.classList.add('text-danger');
                    } else {
                        favoriteButton.classList.remove('text-danger');
                        favoriteButton.classList.add('text-muted');
                    }
                    
                    // Update favorite count
                    const countText = favoriteButton.textContent.trim().split(' ')[1] || '';
                    favoriteButton.innerHTML = `<i class="fas fa-heart me-1"></i> ${data.count}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
    
    // Textarea auto resize
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
    
    // Confirm delete for confessions and comments
    const deleteButtons = document.querySelectorAll('[data-confirm]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm(this.getAttribute('data-confirm'))) {
                e.preventDefault();
            }
        });
    });
});
