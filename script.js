// Initialisation AOS
AOS.init({
    duration: 800,
    once: true
});

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth scrolling pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation de la barre de navigation
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.style.transform = 'translateY(-100%)';
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Animation de confirmation
    const button = contactForm.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
    button.style.backgroundColor = '#27ae60';
    
    // Réinitialisation du formulaire et du bouton après 2 secondes
    setTimeout(() => {
        contactForm.reset();
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 2000);
});

// Bouton scroll to top
const scrollTop = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animation des barres de progression des compétences
const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute('data-progress') + '%';
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.skill-progress').forEach((progress) => {
    observerSkills.observe(progress);
});

// Animation du texte de la section hero
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Initialisation des tooltips pour les liens des projets
const projectLinks = document.querySelectorAll('.project-link');
projectLinks.forEach(link => {
    link.setAttribute('title', link.textContent.trim());
});

// Gestion du mode sombre
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.body.classList.toggle('dark-theme');
} else if (currentTheme === 'light') {
    document.body.classList.toggle('light-theme');
}

// Animation des images des projets au hover
document.querySelectorAll('.project-image').forEach(image => {
    image.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    image.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
});

