// SERVER IP IST BEREITS: allthemods10.servegame.com
const serverIp = "allthemods10.servegame.com";

const statusDiv = document.getElementById('server-status');

async function fetchServerStatus() {
    // Nur ausführen, wenn das statusDiv existiert
    if (!statusDiv) {
        console.warn("Status-Div nicht gefunden. Aktualisierung übersprungen.");
        return;
    }

    // Vor dem Neuladen kurz eine Ladeanzeige zeigen, wenn nicht der erste Ladevorgang
    // Dies ist optional und kann angepasst werden, wie "smooth" der Übergang sein soll.
    // Beim ersten Laden wird der Text bereits im HTML oder initial im JS gesetzt.
    // statusDiv.innerHTML = '<p class="loading">Aktualisiere Serverdaten... ⏳</p>';

    try {
        const response = await fetch(`https://api.mcapi.us/server/status?ip=${serverIp}`);

        if (!response.ok) {
            let errorDetails = response.statusText;
            try {
                const errorData = await response.json();
                if (errorData && errorData.error) {
                    errorDetails = errorData.error;
                }
            } catch (e) {
                // JSON-Parsing fehlgeschlagen, nutze den ursprünglichen statusText
            }
            throw new Error(`API-Fehler: ${errorDetails} (Status: ${response.status})`);
        }

        const data = await response.json();

        const serverNameElement = document.getElementById('static-server-name');
        const serverIpElement = document.getElementById('static-server-ip');
        const serverLogoElement = document.getElementById('server-logo');

        if (serverLogoElement && serverLogoElement.style.display === 'none') { // Nur beim ersten Mal, oder wenn explizit versteckt
            serverLogoElement.style.display = 'block';
        }

        if (data.online) {
            if (serverNameElement && data.motd && data.motd.clean) {
                serverNameElement.textContent = data.motd.clean.replace(/§[0-9a-fk-or]/ig, '');
            } else if (serverNameElement && !serverNameElement.textContent.includes("All the Mods 10 Server")) { // Nur wenn nicht schon Fallback
                 serverNameElement.textContent = "All the Mods 10 Server"; // Fallback-Name
            }
            if (serverIpElement && !serverIpElement.textContent.includes(serverIp)) {
                serverIpElement.textContent = serverIp;
            }

            let playerListHtml = '';
            if (data.players && data.players.sample && data.players.sample.length > 0) {
                playerListHtml = '<h3>Spieler Online:</h3><ul id="player-list">';
                data.players.sample.forEach(player => {
                    const safePlayerName = player.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    playerListHtml += `<li>${safePlayerName}</li>`;
                });
                playerListHtml += '</ul>';
            } else if (data.players && data.players.now > 0) {
                playerListHtml = '<p>Einige Spieler sind online, aber die Namen konnten nicht alle geladen werden.</p>';
            } else {
                playerListHtml = '<p>Keine Spieler online. Sei der Erste! 🥳</p>';
            }

            const serverVersion = data.server && data.server.name ? data.server.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'Nicht verfügbar';
            const onlinePlayers = data.players ? data.players.now : 'N/A';
            const maxPlayers = data.players ? data.players.max : 'N/A';

            statusDiv.innerHTML = `
                <p class="status-online">Server ist Online! ✅</p>
                <p><strong>IP:</strong> ${serverIp}</p>
                <p><strong>Spieler:</strong> ${onlinePlayers} / ${maxPlayers}</p>
                <p><strong>Version:</strong> ${serverVersion}</p>
                ${playerListHtml}
            `;
        } else {
            if (serverNameElement && !serverNameElement.textContent.includes("All the Mods 10 Server")) {
                 serverNameElement.textContent = "All the Mods 10 Server";
            }
            if (serverIpElement && !serverIpElement.textContent.includes(serverIp)) {
                 serverIpElement.textContent = serverIp;
            }

            const errorMessage = data.error ? data.error.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "Server ist Offline oder nicht erreichbar.";
            statusDiv.innerHTML = `
                <p class="status-offline">${errorMessage} ❌</p>
                <p>Die IP <strong>${serverIp}</strong> ist aktuell nicht erreichbar über die API.</p>
                <p>Bitte überprüfe, ob der Server läuft und die Netzwerkeinstellungen korrekt sind.</p>
            `;
        }
    } catch (error) {
        const serverNameElement = document.getElementById('static-server-name');
        const serverIpElement = document.getElementById('static-server-ip');
        const serverLogoElement = document.getElementById('server-logo');

        if (serverLogoElement && serverLogoElement.style.display === 'none') {
            serverLogoElement.style.display = 'block';
        }
        if (serverNameElement && !serverNameElement.textContent.includes("All the Mods 10 Server")) {
            serverNameElement.textContent = "All the Mods 10 Server";
        }
        if (serverIpElement && !serverIpElement.textContent.includes(serverIp)) {
             serverIpElement.textContent = serverIp;
        }

        console.error("Fehler beim Abrufen der Serverdaten:", error);
        const safeErrorMessage = error.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (statusDiv) { // Überprüfen ob statusDiv noch existiert
            statusDiv.innerHTML = `
                <p class="error">Fehler beim Laden der Serverdaten. 😭</p>
                <p><strong>Details:</strong> ${safeErrorMessage}</p>
                <p>Stelle sicher, dass die Server-IP korrekt ist und die API erreichbar ist. Prüfe auch die Browserkonsole (F12) für mehr Details.</p>
            `;
        }
    }
}

// Sicherstellen, dass das DOM geladen ist, bevor wir Elemente suchen und Intervalle starten
document.addEventListener('DOMContentLoaded', () => {
    // Überprüfen, ob das statusDiv wirklich existiert, bevor wir weitermachen
    // Die globale Variable statusDiv wird hier wiederverwendet, aber es ist guter Stil,
    // sicherzustellen, dass sie hier verfügbar ist oder sie neu zu holen.
    if (document.getElementById('server-status')) {
        // 1. Die Serverdaten sofort beim Laden der Seite abrufen
        fetchServerStatus();

        // 2. Ein Intervall einrichten, um fetchServerStatus jede Minute (60000 ms) aufzurufen
        setInterval(fetchServerStatus, 60000); 
        console.log("Automatische Aktualisierung der Serverdaten alle 60 Sekunden gestartet. 🕒");
    } else {
        console.warn("Das Element 'server-status' wurde beim DOMContentLoaded nicht gefunden. Automatische Aktualisierung nicht gestartet.");
    }
});