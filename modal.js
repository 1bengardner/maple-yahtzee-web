import {
  getData as getTrophyData,
  getTopScore,
  getGameSound,
} from "./trophies.js";

const cache = {
  modals: {},
};

function createNodeFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function createModal(parent, htmlContent, {
  htmlContent: preHtmlContent,
  height = "0px",
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
  function clickClose() {
    modal.remove();
    new Audio("static/sfx/game/close.mp3").play();
  }
  function esc(e) {
    if (e.key !== "Escape") {
      return;
    }
    modal.remove();
    new Audio("static/sfx/game/close.mp3").play();
  }
  modal._remove = modal.remove;
  modal.remove = function() {
    document.removeEventListener("keydown", esc);
    modal._remove();
    console.debug("Modal closed.");
  }
  modal.addCloseListeners = function() {
    document.querySelector(".modal .close").addEventListener("click", clickClose);
    document.addEventListener("keydown", esc);
  }
  
  parent.appendChild(modal);
  modal.addCloseListeners();
  document.querySelector(".modal-content").style.maxHeight = `calc(100dvh - 106px - ${height})`;
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
    [350, "🐌‍🌱"],
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
    new Audio("static/sfx/game/bubbles.mp3").play();
  });
  
  const sound = getGameSound(score, yahtzeeCount, gotBonus);
  if (sound) {
    new Audio(`static/sfx/trophies/${sound}`).play();
  }
}

function createTrophyHtml({
  icon,
  title,
  description,
  glass,
  sound,
  timestamp,
  count,
  flavour,
}) {
  const flavourHtml = flavour ? ` – <span class="flavour">${flavour}</span>` : "";
  const countHtml = count > 1 ? `<span class="count">×${count}</span>` : "";
  const onclickHtml = sound ? ` onclick="new Audio('static/sfx/trophies/${sound}').play();"` : "";
  const classHtml = sound ? " grow" : "";
  return `
    <div class="${["trophy", glass].filter(Boolean).join(" ")}">
      <div class="trophy-icon${classHtml}"${onclickHtml}>${icon}</div>
      <div class="trophy-details">
        <span class="trophy-title">${title}</span>
        <span>${description}</span>
        <div class="trophy-footer"><span><span class="timestamp">${new Date(timestamp).toLocaleDateString()}</span>${flavourHtml}</span>${countHtml}</div>
      </div>
    </div>`.trim();
}

export function trophies(parent, playHistory) {
  if (playHistory === cache.history) {
    console.debug("Showing cached trophies modal.");
    restoreModal(parent, cache.modals.trophies);
    return;
  }
  const modalContent = getTrophyData(playHistory).map(createTrophyHtml).reverse().join("");
  const modalHeader = {
    htmlContent: `
      <div class="header">
        <span class="highlight-stat">
          <span class="preface">Top score</span>
          ${getTopScore(playHistory)}
        </span>
        <span class="games-played" title="Games played">
          <span aria-hidden="true">🕹</span>${playHistory.length}
        </span>
      </div>`,
    height: "21px",
  };
  const modal = createModal(parent, modalContent, modalHeader);
  document.querySelector(".modal").ariaLabel = "Trophy Case";
  document.querySelector(".modal").style.width = "680px";
  
  cache.history = playHistory;
  cache.modals.trophies = modal;
}

export function help(parent) {
  if (cache.modals.help) {
    console.debug("Showing cached help modal.");
    restoreModal(parent, cache.modals.help);
    return;
  }
  
  const modal = createModal(parent, `
    <h1>How to Play</h1>
    <div style="text-align: left;">
      <ol>
        <li><span class="help-emphasis">Roll</span>.</li>
        <li><span class="help-emphasis">Hold</span> onto one, two, three, four, five or none of the guys you rolled.</li>
        <li><span class="help-emphasis">Roll</span> again for new guys.</li>
        <li><span class="help-emphasis">Hold</span> any of them.</li>
        <li><span class="help-emphasis">Roll</span> a third time.</li>
        <li>From the top, <span class="help-emphasis">select</span> a category to use up.</li>
        <li>Repeat, until each category has been used up and the game is over.</li>
        <li>Your final score is the total of all the points you got from each category.</li>
      </ol>
      <details style="margin-bottom: 1px;"><summary>Yahtzee Categories…</summary>
        <h2>First Row</h2>
        <ul>
          <li>Snails: Score 1 point for each snail.</li>
          <li>Shrooms: Score 2 points for each shroom.</li>
          <li>Pigs: Score 3 points for each pig.</li>
          <li>Roots: Score 4 points for each root.</li>
          <li>Pandas: Score 5 points for each panda.</li>
          <li>Manos: Score 6 points for each mano (big snail).</li>
        </ul>
        <h2>Second Row</h2>
        <ul>
          <li>Three of a Kind: If you have at least three of the same guy, add up all your guys.</li>
          <li>Four of a Kind: If you have at least four of the same guy, add up all your guys.</li>
          <li>Full House: If you have three of one guy and two of another, score 25 points.</li>
          <li>Small Straight: If you have at least four guys in sequence, score 30 points.</li>
          <li>Large Straight: If you have five guys in sequence, score 40 points.</li>
          <li>Chance: Add up all your guys.</li>
          <li>Yahtzee: If you have five of the same guy, score 50 points.</li>
        </ul>
        <h2>Subtotal Bonus</h2>
        <p>
          You get 35 extra points if your score is 63 or more in the first row of categories.
        </p>
        <h2>Bonus Yahtzee: Joker Rules</h2>
        <p>
          You get 100 extra points if you get another yahtzee. You must select the first-row category that corresponds with your roll. If that category was already used up, you can select any second-row category for points, even if your roll doesn't qualify. If those were already used up, you get 0 points for the category but keep the 100-point bonus.
        </p>
      </details>
    </div>
  `);
  document.querySelector(".modal").style.width = "72ch";
  
  cache.modals.help = modal;
}
