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

    // Beim ersten Laden wird der Text bereits im HTML oder initial im JS gesetzt.
    // Nur wenn schon Inhalt da ist, kurz "Aktualisiere..." zeigen.
    if (statusDiv.innerHTML !== '<p class="loading">Lade Serverdaten... ⏳</p>' && 
        !statusDiv.innerHTML.includes('<p class="serverinfo-loading">')) { // Verhindert Überschreiben der initialen Ladeanzeige
        // Optional: Kurz eine Ladeanzeige für die Status-Box, wenn es sich um eine Aktualisierung handelt
        // statusDiv.innerHTML = '<p class="serverinfo-loading">Aktualisiere Serverdaten... ⏳</p>';
    }


    try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`);

        if (!response.ok) {
            throw new Error(`API-Netzwerkfehler: ${response.statusText} (Status: ${response.status})`);
        }

        const data = await response.json();

        // Logo anzeigen, falls es noch nicht sichtbar ist
        if (serverLogoElement && serverLogoElement.style.display === 'none') {
            serverLogoElement.style.display = 'block';
        }

        // Statischen Servernamen und IP oben füllen (auch wenn Server offline ist, mit Fallback)
        if (serverNameElement) {
            if (data.online && data.motd && data.motd.clean && data.motd.clean.length > 0) {
                serverNameElement.textContent = data.motd.clean.join('\n');
            } else {
                serverNameElement.textContent = "All the Mods 10 Server"; // Fallback
            }
        }
        if (serverIpElement) {
            serverIpElement.textContent = data.hostname || serverIp; // Hostname von API oder die konfigurierte IP
        }


        if (data.online) {
            let playerListHtml = '';
            // ANPASSUNG HIER: Prüfen, ob data.players.list existiert und Elemente hat
            if (data.players && data.players.list && data.players.list.length > 0) {
                playerListHtml = '<h3 class="serverinfo-player-list-h3">Spieler Online:</h3><ul id="player-list" class="serverinfo-player-list-ul">'; // Klassennamen für CSS hinzugefügt
                data.players.list.forEach(player => { // player ist hier potenziell ein Objekt
                    let playerNameString = '';
                    if (typeof player === 'string') {
                        playerNameString = player;
                    } else if (player && typeof player.name === 'string') {
                        playerNameString = player.name; // Greife auf die 'name'-Eigenschaft zu
                    } else {
                        playerNameString = 'Unbekannter Spieler'; // Fallback
                        console.warn("Ungültiges Spielerobjekt in Liste:", player);
                    }
                    
                    // Stelle sicher, dass playerNameString ein String ist, bevor replace aufgerufen wird
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
        const safeErrorMessage = error.message ? error.message.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "Unbekannter Fehler";
        if (statusDiv) {
            statusDiv.innerHTML = `
                <p class="serverinfo-error">Fehler beim Laden der Serverdaten. 😭</p>
                <p><strong>Details:</strong> ${safeErrorMessage}</p> <p>Prüfe die Browserkonsole (F12) für mehr Details. Es könnte ein Problem mit der Netzwerkverbindung oder der API selbst geben.</p>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Statische Elemente initial befüllen, falls gewünscht, oder auf API-Antwort warten
    if (serverNameElement) serverNameElement.textContent = "All the Mods 10 Server"; // Initialer Name
    if (serverIpElement) serverIpElement.textContent = serverIp; // Initiale IP
    if (serverLogoElement) serverLogoElement.style.display = 'block'; // Logo immer anzeigen, wenn vorhanden


    if (document.getElementById('server-status')) {
        // Initiale Ladeanzeige in der Statusbox setzen
        document.getElementById('server-status').innerHTML = '<p class="serverinfo-loading">Lade Serverdaten... ⏳</p>';
        fetchServerStatus(); 
        setInterval(fetchServerStatus, 60000); 
        console.log("Automatische Aktualisierung (mit mcsrvstat.us) für Serverinfo alle 60 Sekunden gestartet. 🕒");
    } else {
        console.warn("Das Element 'server-status' wurde nicht gefunden. Auto-Aktualisierung für Serverinfo nicht gestartet.");
    }
});
