// scripts.js

// Funktion für die schrumpfende Navigation
function setupShrinkingHeader() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Funktion zum Hervorheben des aktiven Navigationslinks
function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        // Berücksichtigt sowohl '/index.html' als auch '/' für die Startseite
        if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Funktion zum Ausblenden des Preloaders
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
}

// Globale Initialisierungsfunktion, die nach dem Laden der Seite ausgeführt wird
document.addEventListener('DOMContentLoaded', function() {
    setupShrinkingHeader();
    highlightActiveNavLink();
    hidePreloader(); // Preloader standardmäßig ausblenden, kann bei Bedarf später wieder eingeblendet werden
});

// Exponiere Funktionen, die von spezifischen HTML-Seiten benötigt werden
window.loadNewsFeed = function(searchTerm = '') {
    // Diese Funktion gehört spezifisch zur index.html und muss dort implementiert bleiben
    // da sie direkt auf das allNewsArticles Array zugreift, das im HTML definiert ist.
    console.warn("loadNewsFeed sollte nur auf der index.html aufgerufen werden.");
};

window.fetchMinecraftServerStatus = async function() {
    // Diese Funktion gehört spezifisch zur minecraft.html
    console.warn("fetchMinecraftServerStatus sollte nur auf der minecraft.html aufgerufen werden.");
};

window.loadLatestDiscordClips = function() {
    // Diese Funktion gehört spezifisch zur discord.html
    console.warn("loadLatestDiscordClips sollte nur auf der discord.html aufgerufen werden.");
};

window.loadClips = function() {
    // Diese Funktion gehört spezifisch zur clips.html
    console.warn("loadClips sollte nur auf der clips.html aufgerufen werden.");
};