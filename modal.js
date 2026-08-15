function createNodeFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function createIcon(score) {
  const icons = [
    [1576, "🪦"],
    [1575, "☠"],
    [1500, "💀"],
    [1000, "🦴"],
    [500, "💥"],
    [450, "📣"],
    [400, "📢"],
    [350, "🌱"],
    [300, "🐼"],
    [250, "🫚"],
    [200, "🐖"],
    [150, "🍄"],
    [100, "🐌"],
    [0, "🎓"],
  ];
  for (const [target, icon] of icons) {
    if (score >= target) {
      return icon;
    }
  }
}

function createStatHtml(value, content) {
  return `
    <div class="stat">
      <span class="value">${value}</span>
      <span class="content">${content}</span>
    </div>
  `;
}

function createDescriptionString(score, yahtzeeCount) {
  const yahtzeeString = yahtzeeCount > 0 ? ` and ${yahtzeeCount} ${yahtzeeCount == 1 ? "yahtzee" : "yahtzees"}` : "";
  return `You finished the game with ${score} points${yahtzeeString}.`;
}

export function gameOver(parent, playAgain, { score, yahtzeeCount, gotBonus }) {
  const modal = createNodeFromHtml(`
<div id="gameover" class="modal-overlay">
  <div class="modal">
    <button class="close">❌</button>
    <div class="icon">${createIcon(score)}</div>

    <h1>Game Over</h1>
    <div class="subtitle">
      ${createDescriptionString(score, yahtzeeCount, gotBonus)}
    </div>

    <div class="stats">
      <div class="stat">
        <span class="value">${score}</span>
        <span class="content">Score</span>
      </div>

      ${gotBonus ? createStatHtml("✓", "Bonus") : ""}

      ${yahtzeeCount > 0 ? createStatHtml(yahtzeeCount, yahtzeeCount == 1 ? "Yahtzee" : "Yahtzees") : ""}
    </div>

    <!-- TODO <button class="primary">
      Share
    </button> -->

    <button id="play-again" class="secondary">
      Play Again
    </button>
  </div>
</div>
`);
  parent.appendChild(modal);
  
  document.getElementById("play-again").addEventListener("click", () => {
    playAgain();
    modal.remove();
  });
  document.querySelector(".modal .close").addEventListener("click", () => {
    modal.remove();
  });
}
