export function handleContactForm() {
    const contactButton = document.querySelector('.contact_button');
    const modal = document.getElementById('contact_modal');
    const closeButton = modal.querySelector('.close-modal');

    contactButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const form = document.getElementById('formulaire');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Code pour gérer l'envoi du formulaire
    });
}

document.addEventListener('DOMContentLoaded', handleContactForm);
