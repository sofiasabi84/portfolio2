// email.js

// Initialise EmailJS avec ton User ID
emailjs.init("F4m4jZmlzbZvU1EWA");

document.getElementById("Devisform").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.send("service_h4sbh6f", "template_1om5qe6", {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    })
    .then(function () {
        alert("Message envoyé avec succès !");
        document.getElementById("Devisform").reset();
    }, function (error) {
        alert("Échec de l'envoi. Réessayez.");
        console.error(error);
    });
});
