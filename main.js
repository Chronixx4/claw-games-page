fetch('/claw-games-page/clips.json?v=' + Date.now())
  .then(response => response.json())
  .then(data => {
    const newestClips = data.slice(0, 3); // Die 3 neuesten Clips
    // ...zeige newestClips auf der Discord-Seite an...
  });