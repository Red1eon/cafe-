// ========================
// MENU - Menu rendering with auto-rotation
// ========================

function getMenuDisplayCount() {
    return window.innerWidth < 768 ? 1 : 4;
}
const MENU_ITEMS = [
    {
        name: "Coffee",
        price: "150",
        description: "Smooth, bold cold brew with a creamy finish.",
        tag: "Iced / Creamy",
        badge: "Popular",
        image: "assets/images/menu/coffee.jpg"
    },
    {
        name: "Latte",
        price: "200",
        description: "Velvety espresso with steamed oat milk.",
        tag: "Hot / Smooth",
        badge: "New",
        image: "assets/images/menu/latte.jpg"
    },
    
];
let menuRotationIndex = 0;
let menuRotationInterval = null;
let menuShowAll = false;
let menuAutoRotating = false;

function renderMenu() {
    const menuGrid = document.getElementById("menu-grid");
    if (!menuGrid) {
        console.error("menuGrid not found");
        return;
    }

    if (!Array.isArray(MENU_ITEMS) || MENU_ITEMS.length === 0) {
        menuGrid.innerHTML = `<div class="col-span-1 md:col-span-2 rounded-sm border border-white/10 bg-espresso/30 p-8 text-center text-cream/60">No menu items yet.</div>`;
        return;
    }
    
    const delayClasses = ["delay-100", "delay-200", "delay-300", "delay-400"];
    
    const displayItems = menuShowAll ? MENU_ITEMS : (() => {
        const itemCount = Math.min(getMenuDisplayCount(), MENU_ITEMS.length);
        const items = [];
        for (let i = 0; i < itemCount; i++) {
            const itemIndex = (menuRotationIndex + i) % MENU_ITEMS.length;
            items.push(MENU_ITEMS[itemIndex]);
        }
        return items;
    })();
    
    const safe = window.SafeUtils;
    menuGrid.innerHTML = displayItems.map((item, index) => {
        return `
        <div class="menu-card bg-espresso-light rounded-sm overflow-hidden group reveal ${delayClasses[index % delayClasses.length]}">
            <div class="aspect-square relative overflow-hidden">
                <img loading="lazy" src="${safe.safeUrl(item.image)}" alt="${safe.safeText(item.name)}" class="w-full h-full object-cover" data-fallback="${safe.FALLBACK_IMAGE}" />
                <div class="absolute inset-0 bg-gradient-to-t from-espresso-light via-transparent to-transparent opacity-60"></div>
                ${item.badge ? `<div class="absolute top-4 right-4 bg-amber text-espresso px-3 py-1 text-xs font-bold tracking-wider uppercase">${safe.safeText(item.badge)}</div>` : ""}
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-serif text-cream group-hover:text-amber transition-colors">${safe.safeText(item.name)}</h3>
                    <span class="text-latte font-serif text-lg">NPR ${safe.safeText(item.price)}</span>
                </div>
                <p class="text-cream/50 text-sm leading-relaxed mb-4">${safe.safeText(item.description)}</p>
                <div class="flex items-center gap-2 text-amber text-xs tracking-wider uppercase">
                    <span class="w-8 h-px bg-amber"></span>
                    ${safe.safeText(item.tag)}
                </div>
            </div>
        </div>`;
    }).join("");
    safe.bindImageFallback(menuGrid);
    
    if (typeof observer !== "undefined" && observer) {
        observer.disconnect();
        observeRevealElements();
    }
}

function startMenuRotation() {
    if (menuRotationInterval) clearInterval(menuRotationInterval);
    menuRotationInterval = setInterval(() => {
        menuRotationIndex = (menuRotationIndex + 1) % MENU_ITEMS.length;
        renderMenu();
    }, 5000);
}

function stopMenuRotation() {
    if (menuRotationInterval) {
        clearInterval(menuRotationInterval);
        menuRotationInterval = null;
    }
}

function initMenu() {
    const menuSection = document.getElementById("menu");
    const menuViewAllBtn = document.getElementById("menu-view-all-btn");
    const menuPrevBtn = document.getElementById("menu-prev-btn");
    const menuNextBtn = document.getElementById("menu-next-btn");
    
    if (menuSection) {
        menuSection.addEventListener("mouseenter", stopMenuRotation);
        menuSection.addEventListener("mouseleave", () => {
            if (menuAutoRotating) startMenuRotation();
        });
    }
    
    if (menuViewAllBtn) {
        menuViewAllBtn.addEventListener("click", () => {
            menuShowAll = !menuShowAll;
            menuViewAllBtn.textContent = menuShowAll ? "Show 4" : "View All";
            menuViewAllBtn.classList.toggle("bg-amber");
            menuViewAllBtn.classList.toggle("text-espresso");
            menuViewAllBtn.classList.toggle("border-amber");
            menuViewAllBtn.classList.toggle("text-amber");
            if (menuShowAll) {
                stopMenuRotation();
            } else if (menuAutoRotating && MENU_ITEMS.length > getMenuDisplayCount()) {
                startMenuRotation();
            }
            renderMenu();
        });
    }

    menuPrevBtn?.addEventListener("click", () => {
        if (menuShowAll || MENU_ITEMS.length <= getMenuDisplayCount()) return;
        menuRotationIndex = (menuRotationIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        renderMenu();
    });

    menuNextBtn?.addEventListener("click", () => {
        if (menuShowAll || MENU_ITEMS.length <= getMenuDisplayCount()) return;
        menuRotationIndex = (menuRotationIndex + 1) % MENU_ITEMS.length;
        renderMenu();
    });

    menuAutoRotating = true;
    if (!menuShowAll && MENU_ITEMS.length > getMenuDisplayCount()) {
        startMenuRotation();
    }
}
