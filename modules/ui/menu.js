import { startGame } from './core/main.js'

window.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-game-btn")
    const titleScreen = document.getElementById("title-screen")
    const mainGame = document.getElementById("main-game")

    startButton.addEventListener("click", () => {
    titleScreen.classList.add("hidden")
    mainGame.classList.remove("hidden")
    
    startGame()  // ← Starts your game loop only after click
    })
})