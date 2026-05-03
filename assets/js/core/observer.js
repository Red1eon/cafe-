// ========================
// ANIMATION OBSERVER - Intersection Observer for scroll animations
// ========================

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.1
};

window.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('active', entry.isIntersecting);
    });
}, observerOptions);

function observeRevealElements() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach(el => observer.observe(el));
}

function enableRevealFallback() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => el.classList.add('active'));
}

if ('IntersectionObserver' in window) {
    window.addEventListener('load', observeRevealElements);
} else {
    enableRevealFallback();
}
