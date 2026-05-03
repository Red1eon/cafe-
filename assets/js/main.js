// ========================
// MAIN - Entry point
// ========================

initNavbar();
initMenu();
initGallery();
initLightbox();

renderMenu();
renderGallery();
observeRevealElements();

// ========================
// LIGHTBOX - Image viewer
// ========================
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
    const lightbox = document.getElementById('lightbox');

    // Click outside to close
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');

    lightboxImages = GALLERY_ITEMS.map(item => ({
        src: window.SafeUtils.safeUrl(item.src),
        alt: window.SafeUtils.safeText(item.alt)
    }));

    const currentIndex = lightboxImages.findIndex(item => item.src === src);
    lightboxIndex = currentIndex >= 0 ? currentIndex : 0;

    img.src = lightboxImages[lightboxIndex].src;
    img.alt = lightboxImages[lightboxIndex].alt;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    const img = document.getElementById('lightbox-img');
    img.src = lightboxImages[lightboxIndex].src;
    img.alt = lightboxImages[lightboxIndex].alt;
}
