import * as modal from "./modal.js";

const StorageKeys = {
  HISTORY: "yahtzee/history",
  QUALIFIED_FOR_TROPHIES: "yahtzee/unlocked trophies",
}

function createNodeFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function showLoading() {
  document.getElementById("mainframe").classList.add("loading");
}
function finishLoading() {
  const mf = document.getElementById("mainframe");
  requestAnimationFrame(() => {
    mf.style.transform = getComputedStyle(mf).transform;
    mf.classList.remove("loading");
    requestAnimationFrame(() => { mf.style.transform = "rotate3d(0, 0, 0, 0deg)"; });
  });
}
function preloadAssets() {
  for (const src of [
    "one.gif",
    "two.gif",
    "three.gif",
    "four.gif",
    "five.gif",
    "six.gif",
  ]) {
    const img = new Image();
    img.src = src;
  }
}
function prepareYahtzee() {
  const stateful = [
    "selectButton",
    "quitButton",
    "rollButton",
    "resetButton",
  ].map(id => document.getElementById(id));
  stateful.push(...[
    "onesButton",
    "twosButton",
    "threesButton",
    "foursButton",
    "fivesButton",
    "sixesButton",
    "threeOfAKindButton",
    "fourOfAKindButton",
    "fullHouseButton",
    "smallStraightButton",
    "largeStraightButton",
    "chanceButton",
    "yahtzeeButton",
  ].map(id => document.getElementById(id).previousElementSibling));
  for (const elem of stateful) {
    elem.setState = state => {
      if (state === "normal") {
        elem.disabled = false;
        elem.classList.remove("used");
      } else if (state === "disabled") {
        elem.disabled = true;
      } else if (state === "used") {
        elem.disabled = true;
        elem.classList.add("used");
      } else {
        console.warn(`${b.id}.setState called with invalid argument "${state}"`)
        return;
      }
      if (elem.checked) {
        elem.checked = false;
      }
    };
  }
  const images = [
    "die1",
    "die2",
    "die3",
    "die4",
    "die5",
  ].map(id => document.getElementById(id));
  for (const elem of images) {
    elem.changeImage = image => {
      elem.src = image;
      elem.animate(
        [
          {
            backgroundColor: "seashell",
            filter: "saturate(1.5)",
          }, {
            backgroundColor: "",
            filter: "saturate(1)",
          },
        ], 
        {
          duration: 777,
          easing: "ease-in-out",
        }
      );
    }
    elem.setImage = image => {
      elem.src = image;
    }
  }
  const labels = [
    "rollScore",
    "rollCountLabel",
    "subTotalLabel",
    "yahtzeeCountLabel",
    "scoreLabel",
  ].map(id => document.getElementById(id));
  for (const elem of labels) {
    elem.setText = text => elem.textContent = text;
  }
  const checkboxes = [
    "dieHold1",
    "dieHold2",
    "dieHold3",
    "dieHold4",
    "dieHold5",
  ].map(id => document.getElementById(id));
  for (const elem of checkboxes) {
    elem.deselect = () => elem.checked = false;
    elem.addEventListener("change", function() {
      new Audio(`static/sfx/game/${this.checked ? "hold_on" : "hold_off"}.mp3`).play();
    });
  }
  const flashyThings = [
    document.getElementById("subTotalLabel"),
    document.getElementById("yahtzeeButton"),
  ];
  for (const elem of flashyThings) {
    elem.flash = () => elem.animate(
      [
        { outline: "none" },
        { outline: "2px solid red" },
        { outline: "2px solid red" },
      ], 
      {
        duration: 120,
        iterations: 10,
        easing: "steps(2)",
      }
    );
  }
  document.getElementById("subTotalLabel").oldFlash = document.getElementById("subTotalLabel").flash;
  document.getElementById("subTotalLabel").flash = function() {
    this.oldFlash();
    navigator.vibrate?.(100);
    new Audio("static/sfx/game/subtotal_bonus.mp3").play();
  };
  document.getElementById("yahtzeeButton").celebrate = () => {
    navigator.vibrate?.([200, 50, 100]);
    new Audio("static/sfx/game/success.mp3").play();
  };
  document.getElementById("yahtzeeButton").fail = () => {
    new Audio("static/sfx/game/failure.mp3").play();
  };
  document.getElementById("subTotalLabel").setEmphasis = function(on) { this.style.fontStyle = on ? "italic" : "" };
  function gameOver(score, yahtzeeCount, gotBonus) {
    modal.gameOver(
      document.body,
      () => document.getElementById("resetButton").click(), 
      {
        score,
        yahtzeeCount,
        gotBonus,
      }
    );
    saveHistory(score, yahtzeeCount, gotBonus);
    const qualified = score >= 100 || yahtzeeCount > 0;
    if (qualified && !document.getElementById("trophies")) {
      localStorage.setItem(StorageKeys.QUALIFIED_FOR_TROPHIES, "true story");
      createTrophiesButton();
    }
  }
  function saveHistory(score, yahtzeeCount, gotBonus) {
    const saved = JSON.parse(localStorage.getItem(StorageKeys.HISTORY));
    history = Array.isArray(saved) ? saved : [];
    history.push({
      t: Date.now(),
      p: score,
      y: yahtzeeCount,
      s: gotBonus,
    });
    localStorage.setItem(StorageKeys.HISTORY, JSON.stringify(history));
  }
  function bonusYahtzee(on) {
    const target = document.getElementById("scoreLabel");
    if (document.getElementById("bonusYahtzee")) {
      document.getElementById("bonusYahtzee").remove();
    }
    if (on) {
      target.before(createNodeFromHtml(`
        <div id="bonusYahtzee">
          <div style="font-style: italic;">Bonus Yahtzee!</div>
          <div>Joker Rules apply</div>
        </div>
      `));
    }
  }
  function damageNumber(damage) {
    const target = document.getElementById("scoreLabel");
    const dn = createNodeFromHtml(`
      <div class="damageNumber">
        <span>${damage}</span>
      </div>
    `);
    target.before(dn);
    setTimeout(() => {
      dn.remove();
    }, 2000);
  }
  const yobject = {
    photoList: ["one.gif", "two.gif", "three.gif", "four.gif", "five.gif", "six.gif", "sel1.gif", "sel2.gif", "sel3.gif", "sel4.gif", "sel5.gif", "sel6.gif", "sel7.gif", "sel8.gif", "sel9.gif", "sel10.gif", "sel11.gif", "sel12.gif", "sel13.gif", "yahtzee.gif", "cards.gif"],
    yPhotoList: [
      "one_y.gif",
      "two_y.gif",
      "three_y.gif",
      "four_y.gif",
      "five_y.gif",
      "six_y.gif",
    ],
    onesButton: document.getElementById("onesButton").previousElementSibling,
    twosButton: document.getElementById("twosButton").previousElementSibling,
    threesButton: document.getElementById("threesButton").previousElementSibling,
    foursButton: document.getElementById("foursButton").previousElementSibling,
    fivesButton: document.getElementById("fivesButton").previousElementSibling,
    sixesButton: document.getElementById("sixesButton").previousElementSibling,
    threeOfAKindButton: document.getElementById("threeOfAKindButton").previousElementSibling,
    fourOfAKindButton: document.getElementById("fourOfAKindButton").previousElementSibling,
    fullHouseButton: document.getElementById("fullHouseButton").previousElementSibling,
    smallStraightButton: document.getElementById("smallStraightButton").previousElementSibling,
    largeStraightButton: document.getElementById("largeStraightButton").previousElementSibling,
    chanceButton: document.getElementById("chanceButton").previousElementSibling,
    yahtzeeButton: document.getElementById("yahtzeeButton").previousElementSibling,
    yahtzeeButton2: document.getElementById("yahtzeeButton"),
    selectButton: document.getElementById("selectButton"),
    quitButton: document.getElementById("quitButton"),
    rollButton: document.getElementById("rollButton"),
    resetButton: document.getElementById("resetButton"),
    die1: document.getElementById("die1"),
    die2: document.getElementById("die2"),
    die3: document.getElementById("die3"),
    die4: document.getElementById("die4"),
    die5: document.getElementById("die5"),
    rollScore: document.getElementById("rollScore"),
    rollCountLabel: document.getElementById("rollCountLabel"),
    subTotalLabel: document.getElementById("subTotalLabel"),
    yahtzeeCountLabel: document.getElementById("yahtzeeCountLabel"),
    scoreLabel: document.getElementById("scoreLabel"),
    dieHold1: document.getElementById("dieHold1"),
    dieHold2: document.getElementById("dieHold2"),
    dieHold3: document.getElementById("dieHold3"),
    dieHold4: document.getElementById("dieHold4"),
    dieHold5: document.getElementById("dieHold5"),
    gameOver,
    bonusYahtzee,
    showIncrement: damageNumber,
  };
  return yobject;
}
async function runYahtzee() {
  const oldTitle = document.title;
  document.title = "Loading…";
  pyodide = await loadPyodide();
  document.title = oldTitle;
  await pyodide.runPython(await (await fetch("Yahtzee.py")).text());
  attachGameHandlers();
}
function attachGameHandlers() {
  document.getElementById("quitButton").addEventListener("click", () => {
    window.location = "/";
    new Audio("static/sfx/game/click.mp3").play();
  });
  document.getElementById("rollButton").addEventListener("click", () => {
    pyodide.globals.get("roll")();
    new Audio("static/sfx/game/click.mp3").play();
  });
  document.getElementById("resetButton").addEventListener("click", () => {
    pyodide.globals.get("resetGame")();
    new Audio("static/sfx/game/click.mp3").play();
  });
  document.getElementById("selectButton").addEventListener("click", () => {
    pyodide.globals.get("select")();
    new Audio("static/sfx/game/plop.mp3").play();
  });
  
  [
    "onesButton",
    "twosButton",
    "threesButton",
    "foursButton",
    "fivesButton",
    "sixesButton",
    "threeOfAKindButton",
    "fourOfAKindButton",
    "fullHouseButton",
    "smallStraightButton",
    "largeStraightButton",
    "chanceButton",
    "yahtzeeButton",
  ].forEach(id => document.getElementById(id).previousElementSibling.addEventListener("click", () => {
    pyodide.globals.get(id.replace("Button", ""))();
    new Audio("static/sfx/game/select.mp3").play();
  }));
}
function attachMetaHandlers() {
  attachZoomHandler();
  attachHelpHandler();
  attachDesktopHandler();
  attachMobileHandler();
}
function attachZoomHandler() {
  const target = document.querySelector("main");
  const targetValue = "0.8";
  document.querySelector(".zoom").addEventListener("click", function() {
    this.classList.add("stay");
    target.style.transformOrigin = "top";
    target.style.scale = target.style.scale == targetValue ? "" : targetValue;
    new Audio("static/sfx/game/plop.mp3").play();
  });
}
function attachHelpHandler() {
  document.querySelector(".help").addEventListener("click", () => {
    modal.help(document.body);
    new Audio("static/sfx/game/bubbles.mp3").play();
  });
}
const VIEW_MODE_PARAM = "view";
const ViewModes = Object.freeze({
  DESKTOP: "desktop",
  MOBILE: "mobile",
});
function attachDesktopHandler() {
  document.querySelector(".desktop")?.addEventListener("click", () => {
    new Audio("static/sfx/game/click.mp3").play();
    if (!confirm("Reload Maple Yahtzee in Desktop Mode?")) return;
    const url = new URL("./", window.location.href);
    url.searchParams.set(VIEW_MODE_PARAM, ViewModes.DESKTOP);
    window.location.href = url.href;
  });
}
function attachMobileHandler() {
  document.querySelector(".mobile")?.addEventListener("click", () => {
    new Audio("static/sfx/game/click.mp3").play();
    if (!confirm("Reload Maple Yahtzee in Mobile Mode?")) return;
    const url = new URL("./", window.location.href);
    url.searchParams.set(VIEW_MODE_PARAM, ViewModes.MOBILE);
    window.location.href = url.href;
  });
}
async function adjustMode() {
  const viewMode = new URLSearchParams(window.location.search).get(VIEW_MODE_PARAM);
  const isMobile = navigator.userAgentData?.mobile || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (viewMode === ViewModes.MOBILE || viewMode === null && isMobile) {
    const mobileContent = new DOMParser().parseFromString(await (await fetch("mobile.html")).text(), "text/html");
    document.head.appendChild(Object.assign(document.createElement("meta"), {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    }));
    document.head.appendChild(Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      type: "text/css",
      href: "mobile.css",
    }));
    document.querySelector("main").replaceWith(mobileContent.querySelector("main"));
  } else if (viewMode === ViewModes.DESKTOP) {
    document.querySelector(".auxiliary").prepend(createNodeFromHtml(`
      <button class="mobile" title="Mobile Mode">📱</button>
    `));
  }
}
function createTrophiesButton() {
  if (!localStorage.getItem(StorageKeys.QUALIFIED_FOR_TROPHIES)) {
    return;
  }
  const firstSibling = document.getElementById("mainframe");
  firstSibling.parentNode.append(createNodeFromHtml(`
    <div class="trophiesContainer">
      <button id="trophies">Trophies</button>
    </div>
  `));
  attachTrophiesHandler();
}
function attachTrophiesHandler() {
  document.getElementById("trophies").addEventListener("click", () => {
    modal.trophies(document.body, history);
    new Audio("static/sfx/game/bubbles.mp3").play();
  });
}
try {
  await adjustMode();
} catch (error) {
  console.warn(`Failed to load view mode!`, error);
}
attachMetaHandlers();
let history = JSON.parse(localStorage.getItem(StorageKeys.HISTORY));
createTrophiesButton();
preloadAssets();
globalThis.yobject = prepareYahtzee();
var pyodide;
showLoading();
runYahtzee().then(finishLoading);
