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
      } else if (state === "disabled") {
        elem.disabled = true;
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
  for (const elem of images) {
    elem.setImage = image => elem.src = image;
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
  document.getElementById("subTotalLabel").setEmphasis = function(on) { this.style.fontStyle = on ? "italic" : "" };
  function gameOver(score, yahtzeeCount, gotBonus) {
    modal.gameOver(document.body, () => document.getElementById("resetButton").click(), {
      score,
      yahtzeeCount,
      gotBonus,
    });
    saveHistory(score, yahtzeeCount, gotBonus);
  }
  function saveHistory(score, yahtzeeCount, gotBonus) {
    const key = "yahtzee/history";
    const saved = JSON.parse(localStorage.getItem(key));
    const history = Array.isArray(saved) ? saved : [];
    history.unshift({
      t: Date.now(),
      p: score,
      y: yahtzeeCount,
      s: gotBonus,
    });
    localStorage.setItem(key, JSON.stringify(history));
  }
  const yobject = {
    photoList: ["one.gif", "two.gif", "three.gif", "four.gif", "five.gif", "six.gif", "sel1.gif", "sel2.gif", "sel3.gif", "sel4.gif", "sel5.gif", "sel6.gif", "sel7.gif", "sel8.gif", "sel9.gif", "sel10.gif", "sel11.gif", "sel12.gif", "sel13.gif", "yahtzee.gif", "cards.gif"],
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
  ].forEach(id => document.getElementById(id).previousElementSibling.addEventListener("click", () => {
    pyodide.globals.get(id.replace("Button", ""))();
  }));
}
globalThis.yobject = prepareYahtzee();
var pyodide;
showLoading();
runYahtzee().then(doneLoading);
