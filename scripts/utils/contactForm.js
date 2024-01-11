const modal = document.getElementById("contact_modal");
const envoiForm = document.querySelector('.envoiForm');

function displayModal() {
	modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

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
    closeModal();
}
