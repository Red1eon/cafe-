// ========================
// NAVBAR - Scroll effects & mobile menu
// ========================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

function initNavbar() {
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('nav-scrolled');
            navbar.classList.remove('py-5');
            navbar.classList.add('py-3');
        } else {
            navbar.classList.remove('nav-scrolled');
            navbar.classList.remove('py-3');
            navbar.classList.add('py-5');
        }
        
        lastScroll = currentScroll;
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.add('hidden');
        });
    });
}
