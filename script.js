// SERVER IP WURDE AKTUALISIERT:
const serverIp = "allthemods10.servegame.com";

// Greife auf das DOM-Element zu, sobald das Skript geladen wird.
// Dank 'defer' im HTML-Script-Tag ist das DOM zu diesem Zeitpunkt bereit.
const statusDiv = document.getElementById('server-status');

async function fetchServerStatus() {
  if (!statusDiv) {
    console.error("Das Element 'server-status' wurde nicht im DOM gefunden.");
    return; // Verhindert weitere Ausführung, wenn das Ziel-Div fehlt
  }
  
  statusDiv.innerHTML = '<p class="loading">Lade Serverdaten... ⏳</p>';
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
        console.warn("Fehler beim Parsen der JSON-Fehlerantwort:", e);
      }
      throw new Error(`API-Fehler: ${errorDetails} (Status: ${response.status})`);
    }
    
    const data = await response.json();
    
    if (data.online) {
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
      const errorMessage = data.error ? data.error.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "Server ist Offline oder nicht erreichbar.";
      statusDiv.innerHTML = `
                <p class="status-offline">${errorMessage} ❌</p>
                <p><strong>IP:</strong> ${serverIp}</p>
                <p>Bitte überprüfe die Server-IP und stelle sicher, dass der Server läuft.</p>
            `;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Serverdaten:", error);
    const safeErrorMessage = error.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    statusDiv.innerHTML = `
            <p class="error">Fehler beim Laden der Serverdaten. 😭</p>
            <p><strong>Details:</strong> ${safeErrorMessage}</p>
            <p>Stelle sicher, dass die Server-IP korrekt ist und die API erreichbar ist. Prüfe auch die Browserkonsole (F12) für mehr Details.</p>
        `;
  }
}

// Rufe die Serverdaten ab. Da 'defer' verwendet wird, ist das DOM beim Ausführen bereit.
if (statusDiv) {
  fetchServerStatus();
} else {
  console.warn("Initialisierung von fetchServerStatus übersprungen, da statusDiv nicht gefunden wurde. Prüfung via DOMContentLoaded wird empfohlen, falls 'defer' fehlt.");
  // Fallback: document.addEventListener('DOMContentLoaded', fetchServerStatus);
}