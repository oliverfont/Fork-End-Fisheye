export function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('input, button, textarea').focus();
}

export function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    document.querySelector('.contact_button').focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.querySelector('.contact_button');
    const closeModalButton = document.querySelector('.close-modal');
    const modal = document.getElementById("contact_modal");

    openModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        displayModal();
    });

    openModalButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            displayModal();
        }
    });

    closeModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal();
    });

    closeModalButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    const form = document.querySelector('#formulaire');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const prenom = document.querySelector("#prenom").value;
        const nom = document.querySelector("#nom").value;
        const email = document.querySelector("#email").value;
        const msg = document.querySelector("#msg").value;

        console.log(`
        Prénom : ${prenom}
        Nom : ${nom}
        Email : ${email}
        Message : ${msg}`);
        
        form.reset(); // Réinitialiser le formulaire après soumission
        closeModal();
    });
});
