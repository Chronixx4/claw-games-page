// JavaScript zum Abrufen der Minecraft-Server-Infos
console.log('Skript gestartet...'); // NEU

const serverIp = 'allthemods10.servegame.com';
const statusElement = document.getElementById('minecraft-status');
console.log('Variablen gesetzt. statusElement:', statusElement); // NEU

fetch(`https://api.mcsrvstat.us/3/${serverIp}`) // Version 3 der API
    .then(response => {
        console.log('Fetch - Erste Antwort erhalten:', response); // NEU
        if (!response.ok) { // NEU: Prüfen, ob die HTTP-Antwort okay ist
            console.error('Fetch - HTTP-Fehler! Status:', response.status); // NEU
            throw new Error(`HTTP error! status: ${response.status}`); // NEU
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetch - Daten verarbeitet (JSON):', data); // NEU
        if (data.online) {
            console.log('Server ist online. Versuche Text zu aktualisieren.'); // NEU
            const onlinePlayers = data.players.online;
            const maxPlayers = data.players.max;
            const freeSlots = maxPlayers - onlinePlayers;
            statusElement.innerHTML = `🟢 Online: ${onlinePlayers} / ${maxPlayers} Spieler (${freeSlots} Plätze frei!)`;
            console.log('Text aktualisiert für Online-Status.'); // NEU
        } else {
            console.log('Server ist offline (laut Daten). Versuche Text zu aktualisieren.'); // NEU
            statusElement.innerHTML = `🔴 Server ist offline oder nicht erreichbar (laut API).`;
            console.log('Text aktualisiert für Offline-Status.'); // NEU
        }
    })
    .catch(error => {
        console.error('Fetch - FEHLER AUFGETRETEN:', error); // MODIFIZIERT
        statusElement.innerHTML = `⚠️ Fehler beim Laden der Spielerdaten. Details im Console-Log.`; // MODIFIZIERT
    });

console.log('Skript-Ende (Fetch wurde gestartet).'); // NEU
// Die überflüssige } am Ende wurde hier entfernt