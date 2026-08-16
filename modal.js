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

function createShareEmoji(score) {
  const emojis = [
    [1576, "🪦"],
    [1575, "☠"],
    [1500, "💀"],
    [1450, "🦴🦴🦴🦴🦴🦴🦴🦴🦴🦴"],
    [1400, "🦴🦴🦴🦴🦴🦴🦴🦴🦴"],
    [1350, "🦴🦴🦴🦴🦴🦴🦴🦴"],
    [1300, "🦴🦴🦴🦴🦴🦴🦴"],
    [1250, "🦴🦴🦴🦴🦴🦴"],
    [1200, "🦴🦴🦴🦴🦴"],
    [1150, "🦴🦴🦴🦴"],
    [1100, "🦴🦴🦴"],
    [1050, "🦴🦴"],
    [1000, "🦴"],
    [950, "💥💥💥💥💥💥💥💥💥💥"],
    [900, "💥💥💥💥💥💥💥💥💥"],
    [850, "💥💥💥💥💥💥💥💥"],
    [800, "💥💥💥💥💥💥💥"],
    [750, "💥💥💥💥💥💥"],
    [700, "💥💥💥💥💥"],
    [650, "💥💥💥💥"],
    [600, "💥💥💥"],
    [550, "💥💥"],
    [500, "💥"],
    [450, "📣"],
    [400, "📢"],
    [350, "🐌🌱"],
    [300, "🐼"],
    [250, "🫚"],
    [200, "🐖"],
    [150, "🍄"],
    [100, "🐌"],
    [0, ""],
  ];
  for (const [target, emoji] of emojis) {
    if (score >= target) {
      return emoji;
    }
  }
}

function createDescriptionString(score, yahtzeeCount) {
  const yahtzeeString = yahtzeeCount > 0 ? ` and ${yahtzeeCount} ${yahtzeeCount == 1 ? "yahtzee" : "yahtzees"}` : "";
  return `You finished the game with ${score} points${yahtzeeString}.`;
}

function createStatHtml(value, content) {
  return `
    <div class="stat">
      <span class="value">${value}</span>
      <span class="content">${content}</span>
    </div>
  `;
}

function createShareHtml() {
  return `
    <button id="share" class="primary">
      Share
    </button>
  `;
}

function share(score, yahtzeeCount) {
  const yahtzeeString = yahtzeeCount > 0 ? `, including ${yahtzeeCount == 1 ? "a" : yahtzeeCount} ${yahtzeeCount == 1 ? "yahtzee" : "yahtzees"}` : "";
  const body = `${createShareEmoji(score)} I got ${score} POINTS in Maple Yahtzee${yahtzeeString}!\u00A0🍁\n\nhttps://1bengardner.github.io/maple-yahtzee-web/`.trim();
  navigator.share({
    title: "Maple Yahtzee!",
    text: body,
  });
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

        ${navigator.canShare ? createShareHtml() : ""}

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
  document.getElementById("share")?.addEventListener("click", () => {
    share(score, yahtzeeCount);
  });
  document.querySelector(".modal .close").addEventListener("click", () => {
    modal.remove();
  });
}
