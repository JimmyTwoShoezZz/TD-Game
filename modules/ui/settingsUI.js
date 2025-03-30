export function updateSettingsContent(tabName) {
    const content = document.getElementById("settings-content")
    content.innerHTML = `<h2>${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings</h2><p>Coming soon...</p>`
    if (tabName === "volume") {
        content.innerHTML = `
          <h2>Volume Settings</h2>
          <p>Adjust audio levels for the game.</p>
          <div style="margin-top: 20px;">
            <div style="margin-bottom: 20px;">
              <label for="global-volume">Global</label>
              <input type="range" id="global-volume" min="0" max="100" value="80" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="music-volume">Music</label>
              <input type="range" id="music-volume" min="0" max="100" value="70" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="sfx-volume">Sound Effects</label>
              <input type="range" id="sfx-volume" min="0" max="100" value="75" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="ui-volume">UI</label>
              <input type="range" id="ui-volume" min="0" max="100" value="60" style="width: 100%;">
            </div>
          </div>`
      } else {
        content.innerHTML = `<h2>${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings</h2><p>Coming soon...</p>`
      }
}