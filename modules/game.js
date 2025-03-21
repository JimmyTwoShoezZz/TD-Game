import {
    updateDeleteMenu
} from "./ui.js"

document.addEventListener("click", (event) => {
    if (!isDeleteMode) return; // ✅ Ignore clicks if not in Delete Mode

    const clickedElement = event.target;
    
    if (clickedElement.classList.contains("tower")) {
        const towerId = clickedElement.dataset.towerId;
        selectedTower = getTowerById(towerId);

        if (selectedTower) {
            console.log(`🗑️ Selected Tower: ${selectedTower.name}`);
            updateDeleteMenu(); // ✅ Enable confirm button now that a tower is selected
        }
    }
});

export function getTowerById() {
    console.log("test")
}