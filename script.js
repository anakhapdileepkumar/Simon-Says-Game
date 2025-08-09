// Colors used in the game
const colors = ["red", "blue", "green", "yellow"];

// Game state variables
let pattern = [];           // Stores the game's sequence
let playerPattern = [];     // Stores the player's clicks
let level = 0;              // Current level
let waitingForInput = false; // True when it's the player's turn

// Get references to DOM elements
const buttons = document.querySelectorAll(".btn");
const statusDisplay = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

/**
 * Flash (highlight) a button for visual feedback
 * @param {string} color - The color of the button to light up
 */
function lightUp(color) {
  const btn = document.querySelector(`.btn.${color}`);
  if (!btn) return;
  btn.classList.add("active");
  setTimeout(() => btn.classList.remove("active"), 500);
}

/**
 * Play the current sequence of colors for the player to watch
 */
function playPattern() {
  waitingForInput = false; // Disable clicks during playback
  playerPattern = [];
  let i = 0;
  const interval = setInterval(() => {
    lightUp(pattern[i]);
    i++;
    if (i >= pattern.length) {
      clearInterval(interval);
      // After playback, allow player input
      setTimeout(() => {
        waitingForInput = true;
        statusDisplay.textContent = `Your turn — Level ${level}`;
      }, 300);
    }
  }, 800); // Delay between flashes
}

/**
 * Start the next round by adding a new random color to the pattern
 */
function nextRound() {
  level++;
  statusDisplay.textContent = `Level ${level} - Watch the pattern`;
  pattern.push(colors[Math.floor(Math.random() * colors.length)]);
  setTimeout(playPattern, 600);
}

/**
 * Handle player's button clicks
 * @param {string} color - The color clicked by the player
 */
function handleClick(color) {
  if (!waitingForInput) return;

  playerPattern.push(color);
  lightUp(color); // Immediate feedback

  const idx = playerPattern.length - 1;
  // If wrong click
  if (playerPattern[idx] !== pattern[idx]) {
    statusDisplay.textContent = `Wrong! Game Over at level ${level}. Press Start to try again.`;
    waitingForInput = false;
    return;
  }

  // If player completed the whole sequence correctly
  if (playerPattern.length === pattern.length) {
    waitingForInput = false;
    statusDisplay.textContent = `Correct! Get ready for next level...`;
    setTimeout(nextRound, 1000);
  }
}

/**
 * Start game when Start button is clicked
 */
startBtn.addEventListener("click", () => {
  pattern = [];
  playerPattern = [];
  level = 0;
  statusDisplay.textContent = "Starting...";
  setTimeout(nextRound, 600);
});

// Add click listeners to all buttons
buttons.forEach(btn => {
  btn.addEventListener("click", () => handleClick(btn.dataset.color));
});
