// JavaScript zum Abrufen der Minecraft-Server-Infos
console.log('Skript gestartet...');

const serverIp = 'allthemods10.servegame.com';
const statusElement = document.getElementById('minecraft-status');
const playerListElement = document.getElementById('player-list'); // NEU: Element für Spielerliste holen
console.log('Variablen gesetzt. statusElement:', statusElement, 'playerListElement:', playerListElement);

fetch(`https://api.mcsrvstat.us/3/${serverIp}`)
    .then(response => {
        console.log('Fetch - Erste Antwort erhalten:', response);
        if (!response.ok) {
            console.error('Fetch - HTTP-Fehler! Status:', response.status);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetch - Daten verarbeitet (JSON):', data);
        if (data.online) {
            console.log('Server ist online. Versuche Text zu aktualisieren.');
            const onlinePlayers = data.players.online;
            const maxPlayers = data.players.max;
            const freeSlots = maxPlayers - onlinePlayers;
            statusElement.innerHTML = `🟢 Online: ${onlinePlayers} / ${maxPlayers} Spieler (${freeSlots} Plätze frei!)`;
            console.log('Text aktualisiert für Online-Status.');

            // NEU: Spielerliste verarbeiten
            if (playerListElement) {
                if (data.players && data.players.list && data.players.list.length > 0) {
                    console.log('Spielerliste vorhanden:', data.players.list);
                    let playerHtml = '<h4>Wer ist online:</h4><ul>';
                    data.players.list.forEach(player => {
                        // HTML-Injection-Schutz: Nur Textinhalt verwenden oder escapen,
                        // aber da die Namen vom API kommen, ist das Risiko hier gering.
                        // Für mehr Sicherheit könnte man `document.createTextNode` verwenden und Elemente manuell bauen.
                        playerHtml += `<li>${player.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`; // Einfaches Escaping
                    });
                    playerHtml += '</ul>';
                    playerListElement.innerHTML = playerHtml;
                    console.log('Spielerliste angezeigt.');
                } else if (onlinePlayers > 0) { // Spieler sind online, aber keine Liste (oder leer)
                    console.log('Server online, aber keine Spielerliste öffentlich oder Liste ist leer.');
                    playerListElement.innerHTML = '<p><small>Namen der Spieler sind nicht öffentlich einsehbar.</small></p>';
                } else { // Niemand online
                    playerListElement.innerHTML = ''; // Keine Spielerliste anzeigen, wenn niemand online ist
                }
            }

        } else {
            console.log('Server ist offline (laut Daten). Versuche Text zu aktualisieren.');
            statusElement.innerHTML = `🔴 Server ist offline oder nicht erreichbar (laut API).`;
            if (playerListElement) {
                playerListElement.innerHTML = ''; // Spielerliste leeren
            }
            console.log('Text aktualisiert für Offline-Status.');
        }
    })
    .catch(error => {
        console.error('Fetch - FEHLER AUFGETRETEN:', error);
        statusElement.innerHTML = `⚠️ Fehler beim Laden der Spielerdaten. Details im Console-Log.`;
        if (playerListElement) {
            playerListElement.innerHTML = ''; // Spielerliste leeren
        }
    });

console.log('Skript-Ende (Fetch wurde gestartet).');