import {
  getData as getTrophyData,
  getTopScore,
  getAverageScore,
  getGameSound,
} from "./trophies.js";

function chooseRandomly(choices) {
  return choices.length === 0 ? undefined : choices[Math.floor(Math.random() * choices.length)];
}

const StorageKeys = {
  DISMISSED_EVENTS: "yahtzee/dismissed",
  HISTORY: "yahtzee/history",
}

const cache = {
  modals: {},
};

const state = {
  isDisplaying: false,
  queuedModal: null,
}

const dismissedEvents = (function() {
  function load() {
    try {
      return JSON.parse(localStorage.getItem(StorageKeys.DISMISSED_EVENTS)) ?? [];
    } catch (error) {
      console.warn(error);
      return [];
    }
  }
  function save(events) {
    try {
      localStorage.setItem(StorageKeys.DISMISSED_EVENTS, JSON.stringify(events));
    } catch (error) {
      console.warn(error);
    }
  }
  function add(event) {
    const events = load();
    events.push(event);
    save(events);
  }
  function has(event) {
    const events = load();
    return events.includes(event);
  }
  
  return {
    add,
    has,
  }
})();

function createNodeFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function gotQueued(modal) {
  if (state.isDisplaying) {
    console.debug("Queueing modal.");
    state.queuedModal = modal; // overwrite; queue has max 1 modal
    return true;
  }
  state.queuedModal = null;
  state.isDisplaying = true;
}

const Outfits = Object.freeze({
  ORIGINAL: undefined,
  CLASSIC: "classic",
  EVENT: "event",
});
function createModal(parent, htmlContent, {
  header = {
    height: undefined,
    htmlContent: undefined,
  },
  options = {
    outfit: undefined,
  },
  callback = () => {},
} = {
  header: {},
  options: {},
  callback: () => {},
}) {
  class ModalError extends Error {
    constructor(message) {
      super(message);
      this.name = "ModalError";
    }
  }
  if (!parent) {
    throw new ModalError("Missing parent.");
  }
  if (gotQueued(() => createModal(parent, htmlContent, { header, options, callback }))) {
    return;
  }
  console.debug("Creating new modal.");
  header.height ??= "0px";
  const modal = createNodeFromHtml(`
    <div class="modal-overlay">
      <div class="modal${options.outfit !== Outfits.ORIGINAL ? " " + options.outfit : ""}" role="dialog" aria-modal="true">
        <button class="close">${options.outfit === Outfits.EVENT ? "🎲" : "❌"}</button>
        ${header.htmlContent ? header.htmlContent.trim() : ""}
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
    state.isDisplaying = false;
    document.removeEventListener("keydown", esc);
    modal._remove();
    console.debug("Modal closed.");
    if (state.queuedModal) {
      console.debug("Serving queued modal.");
      state.queuedModal();
    }
  }
  modal.addCloseListeners = function() {
    document.querySelector(".modal .close").addEventListener("click", clickClose);
    document.addEventListener("keydown", esc);
  }
  
  parent.appendChild(modal);
  modal.addCloseListeners();
  document.querySelector(".modal-content").style.maxHeight = `calc(100dvh - 98px - ${header.height})`;
  callback(modal);
}
function restoreModal(parent, modal, { callback }) {
  if (gotQueued(() => restoreModal(parent, modal, { callback }))) {
    return;
  }
  console.debug("Restoring existing modal.");
  parent.appendChild(modal);
  modal.addCloseListeners();
  callback();
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

export function gameOver(parent, playAgain, { score, yahtzeeCount, gotBonus }) {
  function share(score, yahtzeeCount) {
    const yahtzeeString = yahtzeeCount > 0 ? `, including ${yahtzeeCount == 1 ? "a" : yahtzeeCount} ${yahtzeeCount == 1 ? "yahtzee" : "yahtzees"}${"!".repeat(Math.max(yahtzeeCount - 1, 0))}` : "";
    const body = `${createShareEmoji(score)} I got ${score} POINTS in Maple Yahtzee${yahtzeeString}!\u00A0🍁\n\nhttps://bengardner.ca/yz`.trim();
    navigator.share({
      title: "Maple Yahtzee!",
      text: body,
    });
  }
  createModal(
    parent,
    `
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

      <button id="play-again" class="continue">
        Play Again
      </button>
    `,
    {
      callback: (modal) => {
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
      },
    }
  );
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
  const playSound = () => new Audio("static/sfx/game/bubbles.mp3").play();
  if (playHistory === cache.history) {
    restoreModal(parent, cache.modals.trophies, {
      callback: playSound,
    });
    return;
  }
  function shareScore(score, name) {
    const body = `My ${name} in Maple Yahtzee is ${score}. ${chooseRandomly([
      "Can you beat that?",
      "What's yours?",
      "Let's play!",
    ])} https://bengardner.ca/yz`.trim();
    navigator.share({
      title: "Maple Yahtzee!",
      text: body,
    });
  }
  const modalContent = getTrophyData(playHistory).map(createTrophyHtml).reverse().join("");
  const avgScoreHtml = playHistory.length >= 5 ? `
    <span id="average-score" class="badge-stat${getTopScore(playHistory) > 999 ? " cramped" : ""}" title="Average score">
      <span>${getAverageScore(playHistory)}</span>
      <span class="qualifier">Avg</span>
    </span>`.trim() : "";
  const modalHeader = {
    htmlContent: `
      <div class="header">
        <span id="top-score" class="highlight-stat${getTopScore(playHistory) > 999 ? " cramped" : ""}">
          <span class="preface">Top score</span>
          ${getTopScore(playHistory)}
        </span>
        ${avgScoreHtml}
        <span class="games-played${playHistory.length > 999 ? " cramped" : ""}" title="Games played">
          <span aria-hidden="true" class="games-played-icon"${playHistory.length > 9999 ? " cramped" : ""}>🕹</span>${playHistory.length}
        </span>
      </div>`,
    height: "27px",
  };
  createModal(
    parent,
    modalContent,
    {
      header: modalHeader,
      callback: (modal) => {
        document.querySelector(".modal").ariaLabel = "Trophy Case";
        document.querySelector(".modal").style.width = "72ch";
        
        if (navigator.canShare) {
          document.getElementById("top-score").style.cursor = "pointer";
          document.getElementById("top-score").addEventListener("click", () => {
            shareScore(getTopScore(playHistory), "top score");
            new Audio("static/sfx/game/bubbles.mp3").play();
          });
          document.getElementById("average-score").style.cursor = "pointer";
          document.getElementById("average-score").addEventListener("click", () => {
            shareScore(getAverageScore(playHistory), "average score");
            new Audio("static/sfx/game/bubbles.mp3").play();
          });
        }
        
        cache.history = playHistory;
        cache.modals.trophies = modal;
        
        playSound();
      },
    }
  );
}

export function help(parent) {
  const playSound = () => new Audio("static/sfx/game/bubbles.mp3").play();
  if (cache.modals.help) {
    restoreModal(parent, cache.modals.help, {
      callback: playSound,
    });
    return;
  }
  createModal(
    parent,
    `
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
    `,
    {
      callback: (modal) => {
        document.querySelector(".modal").style.width = "72ch";
        cache.modals.help = modal;
        
        playSound();
      },
    });
}

export function upcomingEvent(parent, eventId, start, end) {
  if (dismissedEvents.has(eventId)) {
    return;
  }
  function share(date, startTime, endTime) {
    const body = `🎲 The *Double YZ* event is almost here! Maple Yahtzee will double your chances of getting a yahtzee on ${date} between ${startTime} and ${endTime} with the magic of Markov chains! Yes, that's just a buzzword to get your attention, but it's also true!\u00A0🍁\n\nhttps://bengardner.ca/yz`.trim();
    navigator.share({
      title: "Maple Yahtzee! Upcoming Event",
      text: body,
    });
  }
  const dateFormat = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const timeFormat = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const date = start.toLocaleDateString("en-CA", dateFormat);
  const startTime = start.toLocaleTimeString("en-US", timeFormat);
  const endTime = end.toLocaleTimeString("en-US", timeFormat);
  createModal(
    parent,
    `
      <h1>Upcoming Event</h1>
      <p>The <em>Double YZ</em> event is almost here!</p>
      <p>Play Maple Yahtzee on ${date} between ${startTime} and ${endTime} for double the chances of getting a yahtzee!</p>

      <div class="single-row">
        ${navigator.canShare ? createShareHtml() : ""}

        <button id="dismiss" class="cancel">
          Dismiss
        </button>
      </div>
    `,
    {
      options: {
        outfit: Outfits.CLASSIC,
      },
      callback: (modal) => {
        document.querySelector(".modal").style.width = "400px";
        
        document.getElementById("dismiss").addEventListener("click", () => {
          dismissedEvents.add(eventId);
          modal.remove();
          new Audio("static/sfx/game/close.mp3").play();
        });
        document.getElementById("share")?.addEventListener("click", () => {
          share(date, startTime, endTime);
          new Audio("static/sfx/game/bubbles.mp3").play();
        });
        
        new Audio("static/sfx/game/notice.mp3").play();
      },
    }
  );
}

export function eventNotice(parent, start, end) {
  function share() {
    const body = `⏰ *It's Double YZ time!* Play now for 2x yahtzees!!\u00A0🍁\n\nhttps://bengardner.ca/yz`.trim();
    navigator.share({
      title: "Maple Yahtzee! Double YZ Event",
      text: body,
    });
  }
  const timeFormat = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const startTime = start.toLocaleTimeString("en-US", timeFormat);
  const endTime = end.toLocaleTimeString("en-US", timeFormat);
  createModal(
    parent,
    `
      <h1>Double YZ</h1>
      <p><em>It's Double YZ time!</em></p>
      <p>Go big or go home! Between ${startTime} and ${endTime} today, your chances of getting a Yahtzee are doubled. Be bold and go for the gold.</p>

      <div class="single-row">
        ${navigator.canShare ? createShareHtml() : ""}

        <button id="close" class="continue">
          Let's Roll!
        </button>
      </div>
    `,
    {
      options: {
        outfit: Outfits.EVENT,
      },
      callback: (modal) => {
        document.querySelector(".modal").style.width = "400px";
        
        document.getElementById("close").addEventListener("click", () => {
          modal.remove();
          new Audio("static/sfx/game/click.mp3").play();
        });
        document.getElementById("share")?.addEventListener("click", () => {
          share();
          new Audio("static/sfx/game/bubbles.mp3").play();
        });
        
        new Audio("static/sfx/game/invite.mp3").play();
      },
    }
  );
}

export function gameData(parent, history, importCallback = () => {}) {
  function share(score, yahtzeeCount) {
    const yahtzeeString = yahtzeeCount > 0 ? `, including ${yahtzeeCount == 1 ? "a" : yahtzeeCount} ${yahtzeeCount == 1 ? "yahtzee" : "yahtzees"}${"!".repeat(Math.max(yahtzeeCount - 1, 0))}` : "";
    const body = `${createShareEmoji(score)} I got ${score} POINTS in Maple Yahtzee${yahtzeeString}!\u00A0🍁\n\nhttps://bengardner.ca/yz`.trim();
    navigator.share({
      title: "Maple Yahtzee!",
      text: body,
    });
  }
  createModal(
    parent,
    `
      <h1>Game Data</h1>
      <p>
        Take your data with you!
      </p>
      <button id="export" class="continue"${!Array.isArray(history) || history.length === 0 ? "disabled" : ""}>
        Export
      </button>
      <button id="import" class="continue">
        Import
      </button>
    `,
    {
      callback: (modal) => {
        document.getElementById("export").addEventListener("click", () => {
          const url = URL.createObjectURL(new Blob([JSON.stringify({
            version: "1",
            history,
          })], { type: "application/json" }));
          Object.assign(document.createElement("a"), {
            href: url,
            download: `maple_yahtzee_game_data-${Date.now()}.json`,
          }).click();
          URL.revokeObjectURL(url);
          
          new Audio("static/sfx/game/click.mp3").play();
        });
        document.getElementById("import").addEventListener("click", () => {
          const States = Object.freeze({
            GOOD: 0,
            BAD: 1,
            IN_PROGRESS: 2,
          });
          function updateText(text, state) {
            const id = "import-status";
            const className = {
              [States.GOOD]: "good",
              [States.BAD]: "bad",
              [States.IN_PROGRESS]: "in-progress",
            }[state];
            document.getElementById(id)?.remove();
            document.getElementById("import").after(Object.assign(document.createElement("span"), {
              id,
              className,
              textContent: text,
            }));
          }
          function backUp(history) {
            localStorage.setItem(`yahtzee/history backup @ ${Date.now()}`, JSON.stringify(history));
          }
          function processImport(event) {
            try {
              JSON.parse(event.target.result);
            } catch (error) {
              updateText("Could not parse the file as JSON.", States.BAD);
              throw error;
            }
            const importedData = JSON.parse(event.target.result);
            if (!Array.isArray(importedData.history)) {
              const errorText = "Data is in an unreadable format.";
              updateText(errorText, States.BAD);
              throw Error(errorText);
            }
            try {
              localStorage.setItem(StorageKeys.HISTORY, JSON.stringify(importedData.history));
            } catch (error) {
              updateText("Could not write to localStorage.", States.BAD);
              throw error;
            }
            backUp(history);
            importCallback(importedData.history);
            updateText("Imported.", States.GOOD);
          }
          function importData(event) {
            if (event.target.files.length !== 1) return;
            updateText("Importing…", States.IN_PROGRESS);
            const reader = new FileReader();
            reader.addEventListener("load", processImport);
            reader.readAsText(event.target.files[0]);
          }
          const input = Object.assign(document.createElement("input"), {
            type: "file",
            accept: ".json",
          })
          input.addEventListener("change", importData);
          input.click();
          
          new Audio("static/sfx/game/bubbles.mp3").play();
        });
        new Audio("static/sfx/game/bubbles.mp3").play();
      },
    }
  );
}
