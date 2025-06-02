// JavaScript zum Abrufen der Minecraft-Server-Infos
console.log('Skript gestartet...');

const serverIp = 'allthemods10.servegame.com';
const statusElement = document.getElementById('minecraft-status'); // Bezieht sich auf den Div, wo der Text reinkommt
const playerListElement = document.getElementById('player-list');
const spinnerElement = document.getElementById('status-loader'); // NEU: Referenz zum Spinner-Element
const updateInterval = 60000; // 60000 Millisekunden = 1 Minute

console.log('Variablen gesetzt. statusElement:', statusElement, 'playerListElement:', playerListElement, 'spinnerElement:', spinnerElement);
console.log(`Update-Intervall gesetzt auf: ${updateInterval / 1000} Sekunden.`);

function updateServerStatus() {
    console.log('Starte Aktualisierung des Serverstatus...');
    if (spinnerElement) {
        spinnerElement.style.display = 'inline-block'; // NEU: Spinner anzeigen
    }

    fetch(`https://api.mcsrvstat.us/3/${serverIp}`)
        .then(response => {
            console.log('Fetch - Erste Antwort erhalten:', response);
            if (!response.ok) {
                console.error('Fetch - HTTP-Fehler! Status:', response.status);
                throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetch - Daten verarbeitet (JSON):', data);
            if (data.online) {
                console.log('Server ist online. Versuche Text zu aktualisieren.');
                const onlinePlayers = data.players.online !== undefined ? data.players.online : 'N/A';
                const maxPlayers = data.players.max !== undefined ? data.players.max : 'N/A';
                const freeSlots = (onlinePlayers !== 'N/A' && maxPlayers !== 'N/A') ? maxPlayers - onlinePlayers : 'N/A';
                
                statusElement.innerHTML = `🟢 Online: ${onlinePlayers} / ${maxPlayers} Spieler (${freeSlots !== 'N/A' ? freeSlots + ' Plätze frei!' : 'Info nicht verfügbar'})`;
                console.log('Text aktualisiert für Online-Status.');

                if (playerListElement) {
                    if (data.players && data.players.list && data.players.list.length > 0) {
                        // ... (Spielerlisten-Logik bleibt gleich) ...
                        let playerHtml = '<h4>Wer ist online:</h4><ul>';
                        data.players.list.forEach(player => {
                            playerHtml += `<li>${player.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`;
                        });
                        playerHtml += '</ul>';
                        playerListElement.innerHTML = playerHtml;
                        console.log('Spielerliste angezeigt.');
                    } else if (onlinePlayers > 0 || (onlinePlayers === 0 && data.players.list && data.players.list.length === 0) ) {
                        playerListElement.innerHTML = '<p><small>Namen der Spieler sind nicht öffentlich einsehbar oder niemand ist namentlich bekannt.</small></p>';
                    } else {
                        playerListElement.innerHTML = '';
                    }
                }

            } else {
                console.log('Server ist offline (laut Daten). Versuche Text zu aktualisieren.');
                statusElement.innerHTML = `🔴 Server ist offline oder nicht erreichbar (laut API).`;
                if (playerListElement) {
                    playerListElement.innerHTML = '';
                }
                console.log('Text aktualisiert für Offline-Status.');
            }
        })
        .catch(error => {
            console.error('Fetch - FEHLER AUFGETRETEN:', error);
            statusElement.innerHTML = `⚠️ Fehler beim Laden der Spielerdaten. Server möglicherweise offline oder API-Problem.`;
            if (playerListElement) {
                playerListElement.innerHTML = '';
            }
        })
        .finally(() => {
            if (spinnerElement) {
                spinnerElement.style.display = 'none'; // NEU: Spinner verstecken
            }
            console.log(`Nächste automatische Aktualisierung in ${updateInterval / 1000} Sekunden...`);
            setTimeout(updateServerStatus, updateInterval);
        });
}

console.log('Starte initiale Abfrage des Serverstatus...');
updateServerStatus(); // Erster Aufruf, um die Daten zu laden und den initialen "Lade..." Text zu ersetzen.

console.log('Skript-Initialisierung abgeschlossen. Automatische Updates sind eingerichtet.');