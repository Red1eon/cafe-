// ========================
// GALLERY - Gallery rendering with masonry layout
// ========================

function getGalleryDisplayCount() {
    return window.innerWidth < 768 ? 1 : 4;
}
const GALLERY_ITEMS = [
    {
        src: "assets/images/gallery/extra-virgine-olve-oil.jpg",
        alt: "Extra virgin olive oil"
    },
    {
        src: "assets/images/gallery/truffle.png",
        alt: "Truffle dish"
    }
];
let galleryRotationIndex = 0;
let galleryRotationInterval = null;
let galleryShowAll = false;
let galleryAutoRotating = false;

function getGallerySpanClass(index) {
    // Uniform layout: every gallery tile has the same size
    return "";
}

function renderGallery() {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) {
        console.error("galleryGrid not found");
        return;
    }

    if (!Array.isArray(GALLERY_ITEMS) || GALLERY_ITEMS.length === 0) {
        galleryGrid.innerHTML = `<div class="col-span-2 md:col-span-4 rounded-sm border border-white/10 bg-espresso/30 p-8 text-center text-cream/60">No gallery photos yet.</div>`;
        return;
    }
    
    const displayItems = galleryShowAll ? GALLERY_ITEMS : (() => {
        const itemCount = Math.min(getGalleryDisplayCount(), GALLERY_ITEMS.length);
        const items = [];
        for (let i = 0; i < itemCount; i++) {
            const itemIndex = (galleryRotationIndex + i) % GALLERY_ITEMS.length;
            items.push(GALLERY_ITEMS[itemIndex]);
        }
        return items;
    })();
    
    const safe = window.SafeUtils;
    galleryGrid.innerHTML = displayItems.map((item, displayIndex) => {
        return `
        <div class="img-zoom rounded-sm overflow-hidden reveal-scale cursor-pointer ${getGallerySpanClass(displayIndex)}" onclick="openLightbox('${safe.safeUrl(item.src)}', '${safe.safeText(item.alt)}')">
            <img src="${safe.safeUrl(item.src)}" alt="${safe.safeText(item.alt)}" class="w-full h-full object-cover" data-fallback="${safe.FALLBACK_IMAGE}" />
        </div>`;
    }).join("");
    safe.bindImageFallback(galleryGrid);
    console.log("Gallery rendered with", displayItems.length, "displayed items from rotation index", galleryRotationIndex);
    
    if (typeof observer !== "undefined" && observer) {
        observer.disconnect();
        observeRevealElements();
    }
}

function startGalleryRotation() {
    if (!Array.isArray(GALLERY_ITEMS) || GALLERY_ITEMS.length <= getGalleryDisplayCount()) return;
    if (galleryRotationInterval) clearInterval(galleryRotationInterval);
    galleryRotationInterval = setInterval(() => {
        galleryRotationIndex = (galleryRotationIndex + 1) % GALLERY_ITEMS.length;
        renderGallery();
    }, 6000);
}

function stopGalleryRotation() {
    if (galleryRotationInterval) {
        clearInterval(galleryRotationInterval);
        galleryRotationInterval = null;
    }
}

function initGallery() {
    const gallerySection = document.getElementById("gallery");
    const galleryViewAllBtn = document.getElementById("gallery-view-all-btn");
    const galleryPrevBtn = document.getElementById("gallery-prev-btn");
    const galleryNextBtn = document.getElementById("gallery-next-btn");
    
    if (gallerySection) {
        gallerySection.addEventListener("mouseenter", stopGalleryRotation);
        gallerySection.addEventListener("mouseleave", () => {
            if (galleryAutoRotating) startGalleryRotation();
        });
    }
    
    if (galleryViewAllBtn) {
        galleryViewAllBtn.addEventListener("click", () => {
            galleryShowAll = !galleryShowAll;
            galleryViewAllBtn.textContent = galleryShowAll ? "Show 4" : "View All";
            galleryViewAllBtn.classList.toggle("bg-amber");
            galleryViewAllBtn.classList.toggle("text-espresso");
            galleryViewAllBtn.classList.toggle("border-amber");
            galleryViewAllBtn.classList.toggle("text-amber");
            if (galleryShowAll) {
                stopGalleryRotation();
            } else if (galleryAutoRotating && GALLERY_ITEMS.length > getGalleryDisplayCount()) {
                startGalleryRotation();
            }
            renderGallery();
        });
    }

    galleryPrevBtn?.addEventListener("click", () => {
        if (galleryShowAll || GALLERY_ITEMS.length <= getGalleryDisplayCount()) return;
        galleryRotationIndex = (galleryRotationIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
        renderGallery();
    });

    galleryNextBtn?.addEventListener("click", () => {
        if (galleryShowAll || GALLERY_ITEMS.length <= getGalleryDisplayCount()) return;
        galleryRotationIndex = (galleryRotationIndex + 1) % GALLERY_ITEMS.length;
        renderGallery();
    });

    galleryAutoRotating = true;
    if (!galleryShowAll && GALLERY_ITEMS.length > getGalleryDisplayCount()) {
        startGalleryRotation();
    }
}
