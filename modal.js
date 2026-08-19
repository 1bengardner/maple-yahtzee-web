import { generateData as generateTrophyData, getTopScore } from "./trophies.js";

const cache = {};

function createNodeFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function createModal(parent, htmlContent, {
  htmlContent: preHtmlContent,
  height = "0",
} = {}) {
  console.debug("Creating new modal.");
  const modal = createNodeFromHtml(`
    <div class="modal-overlay">
      <div class="modal" role="dialog" aria-modal="true">
        <button class="close">❌</button>
        ${preHtmlContent ? preHtmlContent.trim() : ""}
        <div class="modal-content">
          ${htmlContent.trim()}
        </div>
      </div>
    </div>
  `)
  function esc(e) {
    if (e.key !== "Escape") {
      return;
    }
    modal.remove();
  }
  modal._remove = modal.remove;
  modal.remove = function() {
    document.removeEventListener("keydown", esc);
    modal._remove();
    console.debug("Modal closed.");
  }
  modal.addCloseListeners = function() {
    document.querySelector(".modal .close").addEventListener("click", modal.remove);
    document.addEventListener("keydown", esc);
  }
  
  parent.appendChild(modal);
  modal.addCloseListeners();
  document.querySelector(".modal-content").style.maxHeight = `calc(100vh - 120px - ${height})`;
  return modal;
}
function restoreModal(parent, modal) {
  parent.appendChild(modal);
  modal.addCloseListeners();
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
  const yahtzeeString = yahtzeeCount > 0 ? `, including ${yahtzeeCount == 1 ? "a" : yahtzeeCount} ${yahtzeeCount == 1 ? "yahtzee" : "yahtzees"}${"!".repeat(Math.max(yahtzeeCount - 1, 0))}` : "";
  const body = `${createShareEmoji(score)} I got ${score} POINTS in Maple Yahtzee${yahtzeeString}!\u00A0🍁\n\nhttps://bengardner.ca/games/yahtzee/`.trim();
  navigator.share({
    title: "Maple Yahtzee!",
    text: body,
  });
}

export function gameOver(parent, playAgain, { score, yahtzeeCount, gotBonus }) {
  const modal = createModal(parent, `
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
  `);
  
  document.getElementById("play-again").addEventListener("click", () => {
    playAgain();
    modal.remove();
  });
  document.getElementById("share")?.addEventListener("click", () => {
    share(score, yahtzeeCount);
  });
}

function createTrophyHtml({
  icon,
  title,
  description,
  glass,
  sound,
  timestamp,
  count,
}) {
  const countHtml = count > 1 ? `<span class="count">×${count}</span>` : "";
  const onclickHtml = sound ? ` onclick="new Audio('audio/${sound}').play();"` : "";
  const classHtml = sound ? " grow" : "";
  return `
    <div class="${["trophy", glass].filter(Boolean).join(" ")}">
      <div class="trophy-icon${classHtml}"${onclickHtml}>${icon}</div>
      <div class="trophy-details">
        <span class="trophy-title">${title}</span>
        <span>${description}</span>
        <div class="trophy-footer"><span class="timestamp">${new Date(timestamp).toLocaleDateString()}</span>${countHtml}</div>
      </div>
    </div>`.trim();
}

export function trophies(parent, playHistory) {
  if (playHistory === cache.history) {
    console.debug("Showing cached trophies modal.");
    restoreModal(parent, cache.modal);
    return;
  }
  const modalContent = generateTrophyData(playHistory).map(createTrophyHtml).reverse().join("");
  const modalHeader = {
    htmlContent: `
      <div class="header">
        <span class="highlight-stat">
          <span class="preface">Top score</span>
          ${getTopScore(playHistory)}
        </span>
      </div>`,
    height: "32px",
  };
  const modal = createModal(parent, modalContent, modalHeader);
  document.querySelector(".modal").ariaLabel = "Trophy Case";
  document.querySelector(".modal").style.width = "680px";
  
  cache.history = playHistory;
  cache.modal = modal;
}
