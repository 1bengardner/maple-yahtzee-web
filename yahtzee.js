import * as modal from "./modal.js";

function showLoading() {
  document.getElementById("mainframe").classList.add("loading");
}
function doneLoading() {
  const mf = document.getElementById("mainframe");
  requestAnimationFrame(() => {
    mf.style.transform = getComputedStyle(mf).transform;
    mf.classList.remove("loading");
    requestAnimationFrame(() => { mf.style.transform = "rotate3d(0, 0, 0, 0deg)"; });
  });
}
function prepareYahtzee() {
  const buttons = [
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
    "selectButton",
    "quitButton",
    "rollButton",
    "resetButton",
  ].map(id => document.getElementById(id));
  for (const b of buttons) {
    b.setState = state => {
      if (state === "normal") {
        b.disabled = false;
      } else if (state === "disabled") {
        b.disabled = true;
      } else {
        console.log(`${b.id}.setState called with invalid argument "${state}"`)
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
  for (const i of images) {
    i.setImage = image => i.src = image;
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
  }
  const flashyThings = [
    "subTotalLabel",
    "yahtzeeButton",
  ].map(id => document.getElementById(id));
  for (const elem of flashyThings) {
    elem.flash = () => elem.animate(
      [
        { outline: "none" },
        { outline: "1px solid red" },
        { outline: "1px solid red" },
      ], 
      {
        duration: 120,
        iterations: 10,
        easing: "steps(2)",
      }
    );
  }
  function gameOver(score, yahtzeeCount, gotBonus) {
    modal.gameOver(document.body, () => document.getElementById("resetButton").click(), {
      score,
      yahtzeeCount,
      gotBonus,
    });
    // TODO Save achievements
    // saveAchievements(score, yahtzeeCount, gotBonus);
  }
  const yobject = {
    photoList: ["one.gif", "two.gif", "three.gif", "four.gif", "five.gif", "six.gif", "sel1.gif", "sel2.gif", "sel3.gif", "sel4.gif", "sel5.gif", "sel6.gif", "sel7.gif", "sel8.gif", "sel9.gif", "sel10.gif", "sel11.gif", "sel12.gif", "sel13.gif", "yahtzee.gif", "cards.gif"],
    onesButton: document.getElementById("onesButton"),
    twosButton: document.getElementById("twosButton"),
    threesButton: document.getElementById("threesButton"),
    foursButton: document.getElementById("foursButton"),
    fivesButton: document.getElementById("fivesButton"),
    sixesButton: document.getElementById("sixesButton"),
    threeOfAKindButton: document.getElementById("threeOfAKindButton"),
    fourOfAKindButton: document.getElementById("fourOfAKindButton"),
    fullHouseButton: document.getElementById("fullHouseButton"),
    smallStraightButton: document.getElementById("smallStraightButton"),
    largeStraightButton: document.getElementById("largeStraightButton"),
    chanceButton: document.getElementById("chanceButton"),
    yahtzeeButton: document.getElementById("yahtzeeButton"),
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
  };
  return yobject;
}
async function runYahtzee() {
  const oldTitle = document.title;
  document.title = "Loading…";
  pyodide = await loadPyodide();
  document.title = oldTitle;
  await pyodide.runPython(await (await fetch("Yahtzee.py")).text());
  attachHandlers();
}
function attachHandlers() {
  document.getElementById("quitButton").addEventListener("click", () => {
    window.location = "/";
  });
  document.getElementById("rollButton").addEventListener("click", () => {
    pyodide.globals.get("roll")();
  });
  document.getElementById("resetButton").addEventListener("click", () => {
    pyodide.globals.get("resetGame")();
  });
  document.getElementById("selectButton").addEventListener("click", () => {
    pyodide.globals.get("select")();
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
  ].forEach(id => document.getElementById(id).addEventListener("click", () => {
    pyodide.globals.get(id.replace("Button", ""))();
  }));
}
globalThis.yobject = prepareYahtzee();
var pyodide;
showLoading();
runYahtzee().then(doneLoading);
