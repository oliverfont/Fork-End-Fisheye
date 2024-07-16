function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}


const openModal = document.querySelector('.contact_button');
const modal = document.querySelector('.modal');
const closeModalButton = document.querySelector('.close-modal');

openModal.addEventListener('click', () => {
    modal.style.display = 'block';
    modal.querySelector('input, button, textarea').focus();
});

openModal.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        modal.style.display = 'block';
        modal.querySelector('input, button, textarea').focus();
    }
});

closeModalButton.addEventListener('click', closeModal);
closeModalButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    openModal.focus();
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    } else if (event.target === modal) {
        closeModal();
    }
});

const prenom = document.querySelector("#prenom");
const nom = document.querySelector("#nom");
const email = document.querySelector("#email");
const msg = document.querySelector("#msg");
const form = document.querySelector('#formulaire');

form.addEventListener('submit', finForm);

function finForm(e) {
    e.preventDefault();
    console.log(`
    Prénom : ${prenom.value}
    Nom : ${nom.value}
    Email : ${email.value}
    Message : ${msg.value}`);
    modal.style.display = 'none';
}
