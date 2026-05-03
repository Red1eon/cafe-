// ========================
// SAFE UTILS - Shared helpers for rendering text and image URLs
// ========================

const FALLBACK_IMAGE = "assets/images/gallery/cafe-interior-01.jpg";

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function safeText(value) {
    return escapeHtml(value).trim();
}

function safeUrl(value, fallback = FALLBACK_IMAGE) {
    const url = String(value ?? "").trim();
    if (!url) return fallback;
    if (/^(https?:\/\/|data:image\/|assets\/images\/)/i.test(url)) return escapeHtml(url);
    return fallback;
}

function bindImageFallback(root = document) {
    root.querySelectorAll("img[data-fallback]").forEach((img) => {
        img.onerror = () => {
            img.onerror = null;
            img.src = img.dataset.fallback;
        };
    });
}

window.SafeUtils = {
    safeText,
    safeUrl,
    bindImageFallback,
    FALLBACK_IMAGE
};
