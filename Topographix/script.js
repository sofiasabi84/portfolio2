// Navigation mobile
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');

navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Galerie d'images
const mainImage = document.querySelector('.gallery-main img');
const thumbs = document.querySelectorAll('.gallery-thumbs img');
const prevBtn = document.querySelector('.gallery-nav .prev');
const nextBtn = document.querySelector('.gallery-nav .next');

let currentIndex = 0;
const images = [
    'img1.png',
    'img2.jpg',
    'img3.webp'
];

function updateGallery(index) {
    mainImage.src = images[index];
    thumbs.forEach(thumb => thumb.classList.remove('active'));
    thumbs[index].classList.add('active');
    currentIndex = index;
}

prevBtn.addEventListener('click', () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    updateGallery(newIndex);
});

nextBtn.addEventListener('click', () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    updateGallery(newIndex);
});

thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateGallery(index));
});

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Configuration EmailJS
(function() {
    // Remplacez YOUR_PUBLIC_KEY par votre clé publique EmailJS
    emailjs.init("F4m4jZmlzbZvU1EWA");
})();

// Formulaire de contact avec EmailJS
const form = document.getElementById('devisForm');
const notification = document.getElementById('notification');

function showNotification(message, isSuccess = true) {
    notification.textContent = message;
    notification.style.background = isSuccess ? '#10b981' : '#ef4444';
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const templateParams = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    try {
        // Remplacez SERVICE_ID et TEMPLATE_ID par vos IDs EmailJS
        await emailjs.send("service_x6eyy2m", "template_1om5qe6", templateParams);
        showNotification('Votre demande a été envoyée avec succès !');
        form.reset();
    } catch (error) {
        console.error('Erreur EmailJS:', error);
        showNotification('Une erreur est survenue. Veuillez réessayer.', false);
    }
});

// Animation au défilement
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}

const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.1
});

document.querySelectorAll('.service-card, .gallery-container, .contact-grid > *').forEach(el => {
    observer.observe(el);
});