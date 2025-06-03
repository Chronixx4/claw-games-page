// SERVER IP IST BEREITS: allthemods10.servegame.com
const serverIp = "allthemods10.servegame.com";

const statusDiv = document.getElementById('server-status');

async function fetchServerStatus() {
    if (!statusDiv) {
        console.warn("Status-Div nicht gefunden. Aktualisierung übersprungen.");
        return;
    }

    try {
        // NEUE API-URL verwenden
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`);

        // mcsrvstat.us gibt auch bei Fehlern (z.B. Server offline) einen Status 200 OK zurück,
        // aber mit "online: false" im JSON. Echte Fetch-Fehler sind seltener.
        if (!response.ok) {
            // Dieser Block wird seltener ausgelöst als bei mcapi.us, aber zur Sicherheit beibehalten
            throw new Error(`API-Netzwerkfehler: ${response.statusText} (Status: ${response.status})`);
        }

        const data = await response.json();

        const serverNameElement = document.getElementById('static-server-name');
        const serverIpElement = document.getElementById('static-server-ip');
        const serverLogoElement = document.getElementById('server-logo');

        if (serverLogoElement && serverLogoElement.style.display === 'none') {
            serverLogoElement.style.display = 'block';
        }

        if (data.online) {
            // Servername (MOTD)
            if (serverNameElement) {
                if (data.motd && data.motd.clean && data.motd.clean.length > 0) {
                    // motd.clean ist ein Array, wir joinen es für die Anzeige.
                    // Minecraft Farbcodes sind hier schon entfernt.
                    serverNameElement.textContent = data.motd.clean.join('\n');
                } else {
                    serverNameElement.textContent = "All the Mods 10 Server"; // Fallback
                }
            }
            if (serverIpElement && !serverIpElement.textContent.includes(serverIp)) {
                serverIpElement.textContent = serverIp;
            }

            let playerListHtml = '';
            // Spielerliste von data.players.list (wenn vorhanden)
            if (data.players && data.players.list && data.players.list.length > 0) {
                playerListHtml = '<h3>Spieler Online:</h3><ul id="player-list">';
                data.players.list.forEach(playerName => {
                    // Namen sollten bereits sicher sein, aber zur Vorsicht escapen
                    const safePlayerName = playerName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    playerListHtml += `<li>${safePlayerName}</li>`;
                });
                playerListHtml += '</ul>';
            } else if (data.players && data.players.online > 0) {
                playerListHtml = '<p>Einige Spieler sind online, aber die Namen konnten nicht alle geladen werden oder sind versteckt.</p>';
            } else {
                playerListHtml = '<p>Keine Spieler online. Sei der Erste! 🥳</p>';
            }

            // Serverversion von data.version
            const serverVersion = data.version ? data.version.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'Nicht verfügbar';
            // Spielerzahlen von data.players.online und data.players.max
            const onlinePlayers = data.players ? data.players.online : 'N/A';
            const maxPlayers = data.players ? data.players.max : 'N/A';

            statusDiv.innerHTML = `
                <p class="status-online">Server ist Online! ✅</p>
                <p><strong>IP:</strong> ${data.hostname || serverIp}</p> <p><strong>Spieler:</strong> ${onlinePlayers} / ${maxPlayers}</p>
                <p><strong>Version:</strong> ${serverVersion}</p>
                ${playerListHtml}
            `;
        } else { // Server ist laut API offline
            if (serverNameElement && !serverNameElement.textContent.includes("All the Mods 10 Server")) {
                 serverNameElement.textContent = "All the Mods 10 Server";
            }
            if (serverIpElement && !serverIpElement.textContent.includes(serverIp)) {
                 serverIpElement.textContent = serverIp;
            }

            statusDiv.innerHTML = `
                <p class="status-offline">Server ist Offline oder nicht erreichbar. ❌</p>
                <p>Die IP <strong>${serverIp}</strong> ist aktuell nicht über die API erreichbar.</p>
                <p>Bitte überprüfe, ob der Server läuft und die Netzwerkeinstellungen korrekt sind.</p>
            `;
        }
    } catch (error) { // Catch für Fetch-Fehler oder JSON-Parse-Fehler
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

        console.error("Fehler beim Abrufen oder Verarbeiten der Serverdaten:", error);
        const safeErrorMessage = error.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (statusDiv) {
            statusDiv.innerHTML = `
                <p class="error">Fehler beim Laden der Serverdaten. 😭</p>
                <p><strong>Details:</strong> ${safeErrorMessage}</p>
                <p>Prüfe die Browserkonsole (F12) für mehr Details. Es könnte ein Problem mit der Netzwerkverbindung oder der API selbst geben.</p>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('server-status')) {
        fetchServerStatus(); // Sofortiger Aufruf
        setInterval(fetchServerStatus, 60000); // Jede Minute aktualisieren
        console.log("Automatische Aktualisierung (mit mcsrvstat.us) alle 60 Sekunden gestartet. 🕒");
    } else {
        console.warn("Das Element 'server-status' wurde nicht gefunden. Auto-Aktualisierung nicht gestartet.");
    }
});