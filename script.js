// SERVER IP IST BEREITS: allthemods10.servegame.com
const serverIp = "allthemods10.servegame.com";

const statusDiv = document.getElementById('server-status');
// IDs für die statischen Elemente oben auf der Seite
const serverNameElement = document.getElementById('static-server-name');
const serverIpElement = document.getElementById('static-server-ip');
const serverLogoElement = document.getElementById('server-logo');


async function fetchServerStatus() {
    if (!statusDiv) {
        console.warn("Status-Div nicht gefunden. Aktualisierung übersprungen.");
        return;
    }

    if (statusDiv.innerHTML !== '<p class="loading">Lade Serverdaten... ⏳</p>' &&
        !statusDiv.innerHTML.includes('<p class="serverinfo-loading">')) {
        // statusDiv.innerHTML = '<p class="serverinfo-loading">Aktualisiere Serverdaten... ⏳</p>';
    }

    try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`);
        if (!response.ok) {
            throw new Error(`API-Netzwerkfehler: ${response.statusText} (Status: ${response.status})`);
        }
        const data = await response.json();

        if (serverLogoElement && serverLogoElement.style.display === 'none') {
            serverLogoElement.style.display = 'block';
        }

        if (serverNameElement) {
            if (data.online && data.motd && data.motd.clean && data.motd.clean.length > 0) {
                serverNameElement.textContent = data.motd.clean.join('\n');
            } else {
                serverNameElement.textContent = "All the Mods 10 Server";
            }
        }
        if (serverIpElement) {
            serverIpElement.textContent = data.hostname || serverIp;
        }

        if (data.online) {
            let playerListHtml = '';
            if (data.players && data.players.list && data.players.list.length > 0) {
                playerListHtml = '<h3 class="serverinfo-player-list-h3">Spieler Online:</h3><ul id="player-list" class="serverinfo-player-list-ul">';
                data.players.list.forEach(player => {
                    let playerNameString = '';
                    if (typeof player === 'string') {
                        playerNameString = player;
                    } else if (player && typeof player.name === 'string') {
                        playerNameString = player.name;
                    } else {
                        playerNameString = 'Unbekannter Spieler';
                        console.warn("Ungültiges Spielerobjekt in Liste:", player);
                    }
                    const safePlayerName = playerNameString.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    playerListHtml += `<li>${safePlayerName}</li>`;
                });
                playerListHtml += '</ul>';
            } else if (data.players && data.players.online > 0) {
                playerListHtml = '<p>Einige Spieler sind online, aber die Namen konnten nicht alle geladen werden oder sind versteckt.</p>';
            } else {
                playerListHtml = '<p>Keine Spieler online. Sei der Erste! 🥳</p>';
            }

            const serverVersion = data.version ? data.version.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'Nicht verfügbar';
            const onlinePlayers = data.players ? data.players.online : 'N/A';
            const maxPlayers = data.players ? data.players.max : 'N/A';

            statusDiv.innerHTML = `
                <p class="serverinfo-status-online">Server ist Online! ✅</p>
                <p><strong>IP:</strong> ${data.hostname || serverIp}</p>
                <p><strong>Spieler:</strong> ${onlinePlayers} / ${maxPlayers}</p>
                <p><strong>Version:</strong> ${serverVersion}</p>
                ${playerListHtml}
            `;
        } else {
            statusDiv.innerHTML = `
                <p class="serverinfo-status-offline">Server ist Offline oder nicht erreichbar. ❌</p>
                <p>Die IP <strong>${data.hostname || serverIp}</strong> ist aktuell nicht über die API erreichbar.</p>
                <p>Bitte überprüfe, ob der Server läuft und die Netzwerkeinstellungen korrekt sind.</p>
            `;
        }
    } catch (error) {
        console.error("Fehler beim Abrufen oder Verarbeiten der Serverdaten:", error);
        const safeErrorMessage = error.message ? error.message.replace(/</g, "„&lt;“").replace(/>/g, "„&gt;“") : "Unbekannter Fehler";
        if (statusDiv) {
            statusDiv.innerHTML = `
                <p class="serverinfo-error">Fehler beim Laden der Serverdaten. 😭</p>
                <p><strong>Details:</strong> ${safeErrorMessage}</p> <p>Prüfe die Browserkonsole (F12) für mehr Details. Es könnte ein Problem mit der Netzwerkverbindung oder der API selbst geben.</p>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (serverNameElement) serverNameElement.textContent = "All the Mods 10 Server";
    if (serverIpElement) serverIpElement.textContent = serverIp;
    if (serverLogoElement) serverLogoElement.style.display = 'block';

    if (document.getElementById('server-status')) {
        document.getElementById('server-status').innerHTML = '<p class="serverinfo-loading">Lade Serverdaten... ⏳</p>';
        fetchServerStatus();
        setInterval(fetchServerStatus, 60000);
        console.log("Automatische Aktualisierung (mit mcsrvstat.us) für Serverinfo alle 60 Sekunden gestartet. 🕒");
    } else {
        console.warn("Das Element 'server-status' wurde nicht gefunden. Auto-Aktualisierung für Serverinfo nicht gestartet.");
    }
});

// ===============================================
// JAVASCRIPT FÜR BILDVERGRÖSSERUNG (GALLERY)
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // Holen des Modals, des Bildes im Modal und des Schließen-Buttons
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('img01');
    const captionText = document.getElementById('caption');
    const closeBtn = document.getElementsByClassName('close-button')[0];

    // Alle anklickbaren Galeriebilder auswählen
    const galleryImages = document.querySelectorAll('.gallery-image-clickable');

    // Event Listener für jedes Galeriebild hinzufügen
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Modal anzeigen
            modal.style.display = 'flex'; // 'flex' statt 'block' für Zentrierung
            // Bild im Modal auf das angeklickte Bild setzen (data-large-src bevorzugen)
            modalImg.src = this.getAttribute('data-large-src') || this.src;
            // Bildunterschrift setzen (hier den Text des Erstellers nutzen)
            const builderNameElement = this.nextElementSibling?.querySelector('.builder-name');
            if (builderNameElement) {
                captionText.innerHTML = `Erbaut von: ${builderNameElement.textContent}`;
            } else {
                captionText.innerHTML = this.alt; // Fallback zum alt-Text
            }
        });
    });

    // Event Listener für den Schließen-Button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Event Listener, um das Modal zu schließen, wenn außerhalb des Bildes geklickt wird
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Optional: Schließen mit ESC-Taste
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
});
